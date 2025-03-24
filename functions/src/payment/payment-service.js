import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * 결제 처리 함수
 * @param {string} userId - 사용자 ID
 * @param {number} amount - 결제 금액
 * @param {Object} reservationData - 예약 정보
 * @returns {Object} - 결제 결과
 */
export const processPayment = async (userId, amount, reservationData) => {
  try {
    // 전달 인자 검사
    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        message: '유효하지 않은 사용자 ID입니다.',
      };
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return {
        success: false,
        message: '유효하지 않은 결제 금액입니다.',
      };
    }

    if (!reservationData || typeof reservationData !== 'object') {
      return {
        success: false,
        message: '예약 정보가 유효하지 않습니다.',
      };
    }

    // reservationData 검증
    // 필드 검증
    const requiredFields = [
      'hotelId',
      'hotelName',
      'checkIn',
      'checkOut',
      'guestCount',
      'reservation_name',
      'reservation_phone',
      'reservation_email',
      'reservation_request',
    ];

    const missingFields = requiredFields.filter(
      field => !reservationData[field],
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `다음 필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
      };
    }

    // 날짜 검증
    // 날짜/형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
      !dateRegex.test(reservationData.checkIn) ||
      !dateRegex.test(reservationData.checkOut)
    ) {
      return {
        success: false,
        message: '날짜는 YYYY-MM-DD 형식이어야 합니다.',
      };
    }
    // 날짜/유효성 검사
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return {
        success: false,
        message: '유효하지 않은 날짜입니다.',
      };
    }

    // 날짜/논리 체크
    if (checkInDate >= checkOutDate) {
      return {
        success: false,
        message: '체크아웃 날짜는 체크인 날짜 이후여야 합니다.',
      };
    }

    // 게스트 검증
    if (reservationData.guestCount !== undefined) {
      if (
        typeof reservationData.guestCount !== 'number' ||
        reservationData.guestCount <= 0
      ) {
        return {
          success: false,
          message: '유효하지 않은 게스트 수입니다.',
        };
      }
    }

    // 초기화
    const db = getFirestore();
    const userRef = db.collection('users').doc(userId);

    return await db.runTransaction(async transaction => {
      // 사용자 정보 조회
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        console.log('사용자를 찾을 수 없음:', userId);
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      const userData = userDoc.data();
      const currentPoints =
        typeof userData.points === 'number' ? userData.points : 0;

      // 포인트 비교
      if (currentPoints < amount) {
        return {
          success: false,
          message: '포인트가 부족합니다.',
          currentPoints: currentPoints,
          requiredPoints: amount,
        };
      }

      const timestamp = FieldValue.serverTimestamp();

      // 유저 데이터에 포인트 반영
      transaction.update(userRef, {
        points: currentPoints - amount,
        updatedAt: timestamp,
      });

      // 예약 처리
      const reservationId = `${userId}_${Date.now()}`;
      const reservationRef = db.collection('reservations').doc(reservationId);

      const completeReservationData = {
        userId: userId,
        amount: amount,
        paymentDate: timestamp,
        status: 'confirmed',
        createdAt: timestamp,
        ...reservationData,
      };

      transaction.set(reservationRef, completeReservationData);

      // 포인트 기록 처리
      const pointHistoryRef = db.collection('pointHistory').doc();
      const pointHistoryData = {
        userId: userId,
        type: 'use',
        amount: amount,
        remainingPoints: currentPoints - amount,
        description: `예약 결제 (예약 ID: ${reservationId})`,
        reservationId: reservationId,
        createdAt: timestamp,
        metadata: {
          reservationType: reservationData.type || '일반 예약',
        },
      };

      // 전송 기록 처리
      transaction.set(pointHistoryRef, pointHistoryData);

      const transactionRef = db
        .collection('transactions')
        .doc(`${userId}_${Date.now()}`);

      transaction.set(transactionRef, {
        userId: userId,
        type: 'payment',
        amount: amount,
        reservationId: reservationId,
        description: '예약 결제',
        createdAt: timestamp,
      });

      // 결제 완료 내용 전송
      return {
        success: true,
        message: '결제가 성공적으로 처리되었습니다.',
        reservationId: reservationId,
        remainingPoints: currentPoints - amount,
        reservation: completeReservationData,
      };
    });
  } catch (error) {
    console.error('결제 처리 중 오류 발생:', error);

    return {
      success: false,
      message: '결제 처리 중 오류가 발생했습니다.',
      error: error.message,
    };
  }
};
