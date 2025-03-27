import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * 결제 처리 함수
 * @param {Object} data - 결제 처리에 필요한 데이터
 * @returns {Object} - 결제 결과
 */
export const processPayment = async data => {
  const { user, roomId, userInput, transactionId, timestamp } = data;

  try {
    // user 검증
    if (!user || !user.uid || typeof user.uid !== 'string') {
      return {
        success: false,
        message: '유효하지 않은 사용자 정보입니다.',
      };
    }

    // roomId 검증
    if (!roomId || typeof roomId !== 'string') {
      return {
        success: false,
        message: '유효하지 않은 객실 ID입니다.',
      };
    }

    // userInput 검증
    if (!userInput) {
      return {
        success: false,
        message: '예약 정보가 누락되었습니다.',
      };
    }

    // userInput 필수 필드 검증
    const requiredFields = [
      'name',
      'phone',
      'email',
      'agreement',
      'paymentMethod',
      'paymentAmount',
      'guestCount',
      'checkIn',
      'checkOut',
    ];

    const missingFields = requiredFields.filter(
      field => userInput[field] === undefined || userInput[field] === null,
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `다음 필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
      };
    }

    // 결제 금액 검증
    if (
      !userInput.paymentAmount
      || typeof userInput.paymentAmount !== 'number'
      || userInput.paymentAmount <= 0
    ) {
      return {
        success: false,
        message: '유효하지 않은 결제 금액입니다.',
      };
    }

    // 포인트 검증co
    if (
      userInput.point !== undefined
      && (typeof userInput.point !== 'number' || userInput.point < 0)
    ) {
      return {
        success: false,
        message: '유효하지 않은 포인트입니다.',
      };
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/; // YY-MM-DD 형식 확인
    if (
      !dateRegex.test(userInput.checkIn)
      || !dateRegex.test(userInput.checkOut)
    ) {
      return {
        success: false,
        message: '날짜는 YY-MM-DD 형식이어야 합니다.',
      };
    }

    // 날짜 변환 및 유효성 검사
    const checkInParts = userInput.checkIn.split('-');
    const checkOutParts = userInput.checkOut.split('-');

    // YY-MM-DD 형식을 20YY-MM-DD 형식으로 변환
    const checkInDate = new Date(
      `20${checkInParts[0]}-${checkInParts[1]}-${checkInParts[2]}`,
    );
    const checkOutDate = new Date(
      `20${checkOutParts[0]}-${checkOutParts[1]}-${checkOutParts[2]}`,
    );

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return {
        success: false,
        message: '유효하지 않은 날짜입니다.',
      };
    }

    // 날짜 논리 검증
    if (checkInDate >= checkOutDate) {
      return {
        success: false,
        message: '체크아웃 날짜는 체크인 날짜 이후여야 합니다.',
      };
    }

    // 게스트 수 검증
    if (typeof userInput.guestCount !== 'number' || userInput.guestCount <= 0) {
      return {
        success: false,
        message: '유효하지 않은 게스트 수입니다.',
      };
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInput.email)) {
      return {
        success: false,
        message: '유효하지 않은 이메일 형식입니다.',
      };
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[\d\-]{10,13}$/;
    if (!phoneRegex.test(userInput.phone)) {
      return {
        success: false,
        message: '유효하지 않은 전화번호 형식입니다.',
      };
    }

    // 동의 확인
    if (userInput.agreement !== true) {
      return {
        success: false,
        message: '이용 약관에 동의해야 합니다.',
      };
    }

    // Firestore 초기화
    const db = getFirestore();
    const userRef = db.collection('users').doc(user.uid);
    const roomRef = db.collection('rooms').doc(roomId);

    return await db.runTransaction(async transaction => {
      // 사용자 정보 조회
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        console.log('사용자를 찾을 수 없음:', user.uid);
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 객실 정보 조회
      const roomDoc = await transaction.get(roomRef);
      if (!roomDoc.exists) {
        console.log('객실을 찾을 수 없음:', roomId);
        return {
          success: false,
          message: '객실을 찾을 수 없습니다.',
        };
      }

      const userData = userDoc.data();
      const roomData = roomDoc.data();

      // 사용자 포인트 확인
      const currentPoints =
        typeof userData.points === 'number' ? userData.points : 0;
      const usePoints = userInput.point || 0;

      // 포인트가 충분한지 확인
      if (currentPoints < usePoints) {
        return {
          success: false,
          message: '포인트가 부족합니다.',
          currentPoints: currentPoints,
          requiredPoints: usePoints,
        };
      }

      const serverTimestamp = FieldValue.serverTimestamp();
      const currentTimestamp = timestamp || Date.now();

      // 예약 ID 생성
      const reservationId = `${user.uid}_${currentTimestamp}`;

      // 최종 지불 금액
      const finalPaymentAmount = userInput.paymentAmount - usePoints;

      // 사용자 포인트 차감
      if (usePoints > 0) {
        transaction.update(userRef, {
          points: currentPoints - usePoints,
          updatedAt: serverTimestamp,
        });
      }

      // 예약 정보 생성
      const reservationRef = db.collection('reservations').doc(reservationId);
      const reservationData = {
        userId: user.uid,
        userEmail: user.email,
        userDisplayName: user.displayName,
        roomId: roomId,
        roomName: roomData.name || '객실 정보 없음',
        paymentAmount: userInput.paymentAmount,
        pointsUsed: usePoints,
        finalAmount: finalPaymentAmount,
        paymentMethod: userInput.paymentMethod,
        status: 'confirmed',
        guestCount: userInput.guestCount,
        name: userInput.name,
        phone: userInput.phone,
        email: userInput.email,
        request: userInput.request || '',
        checkIn: userInput.checkIn,
        checkOut: userInput.checkOut,
        agreement: userInput.agreement,
        transactionId: transactionId,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
      };

      transaction.set(reservationRef, reservationData);

      // 포인트 사용 기록 (포인트를 사용한 경우에만)
      if (usePoints > 0) {
        const pointHistoryRef = db.collection('pointHistory').doc();
        const pointHistoryData = {
          userId: user.uid,
          type: 'use',
          amount: usePoints,
          remainingPoints: currentPoints - usePoints,
          description: `예약 결제 포인트 사용 (예약 ID: ${reservationId})`,
          reservationId: reservationId,
          createdAt: serverTimestamp,
          metadata: {
            reservationType: '숙소 예약',
            roomId: roomId,
          },
        };

        transaction.set(pointHistoryRef, pointHistoryData);
      }

      // 결제 트랜잭션 기록
      const transactionRef = db
        .collection('transactions')
        .doc(transactionId || `${user.uid}_${currentTimestamp}`);
      const transactionData = {
        userId: user.uid,
        type: 'payment',
        paymentMethod: userInput.paymentMethod,
        amount: finalPaymentAmount,
        pointsUsed: usePoints,
        totalAmount: userInput.paymentAmount,
        reservationId: reservationId,
        description: '객실 예약 결제',
        status: 'completed',
        roomId: roomId,
        createdAt: serverTimestamp,
      };

      transaction.set(transactionRef, transactionData);

      // 결제 완료 응답
      return {
        success: true,
        message: '결제가 성공적으로 처리되었습니다.',
        reservationId: reservationId,
        transactionId: transactionId || `${user.uid}_${currentTimestamp}`,
        remainingPoints: currentPoints - usePoints,
        pointsUsed: usePoints,
        paymentAmount: finalPaymentAmount,
        totalAmount: userInput.paymentAmount,
        reservation: reservationData,
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
