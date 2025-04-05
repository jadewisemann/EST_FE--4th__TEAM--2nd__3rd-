import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export const processPayment = async data => {
  const { user, roomId, userInput, transactionId, timestamp } = data;

  try {
    if (!user || !user.uid || typeof user.uid !== 'string') {
      return {
        success: false,
        message: '유효하지 않은 사용자 정보입니다.',
      };
    }

    if (!roomId || typeof roomId !== 'string') {
      return {
        success: false,
        message: '유효하지 않은 객실 ID입니다.',
      };
    }

    if (!userInput) {
      return {
        success: false,
        message: '예약 정보가 누락되었습니다.',
      };
    }

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

    if (
      userInput.point !== undefined
      && (typeof userInput.point !== 'number' || userInput.point < 0)
    ) {
      return {
        success: false,
        message: '유효하지 않은 포인트입니다.',
      };
    }

    const yymmddRegex = /^\d{2}-\d{2}-\d{2}$/;
    const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;

    let checkIn = userInput.checkIn;
    let checkOut = userInput.checkOut;

    if (yymmddRegex.test(checkIn)) {
      const parts = checkIn.split('-');
      checkIn = `20${parts[0]}-${parts[1]}-${parts[2]}`;
    } else if (!yyyymmddRegex.test(checkIn)) {
      return {
        success: false,
        message: '체크인 날짜는 YYYY-MM-DD 또는 YY-MM-DD 형식이어야 합니다.',
      };
    }

    if (yymmddRegex.test(checkOut)) {
      const parts = checkOut.split('-');
      checkOut = `20${parts[0]}-${parts[1]}-${parts[2]}`;
    } else if (!yyyymmddRegex.test(checkOut)) {
      return {
        success: false,
        message: '체크아웃 날짜는 YYYY-MM-DD 또는 YY-MM-DD 형식이어야 합니다.',
      };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return {
        success: false,
        message: '유효하지 않은 날짜입니다.',
      };
    }

    if (checkInDate >= checkOutDate) {
      return {
        success: false,
        message: '체크아웃 날짜는 체크인 날짜 이후여야 합니다.',
      };
    }

    if (typeof userInput.guestCount !== 'number' || userInput.guestCount <= 0) {
      return {
        success: false,
        message: '유효하지 않은 게스트 수입니다.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInput.email)) {
      return {
        success: false,
        message: '유효하지 않은 이메일 형식입니다.',
      };
    }

    const phoneRegex = /^[\d\-]{10,13}$/;
    if (!phoneRegex.test(userInput.phone)) {
      return {
        success: false,
        message: '유효하지 않은 전화번호 형식입니다.',
      };
    }

    if (userInput.agreement !== true) {
      return {
        success: false,
        message: '이용 약관에 동의해야 합니다.',
      };
    }

    const db = getFirestore();
    const userRef = db.collection('users').doc(user.uid);
    const roomRef = db.collection('rooms').doc(roomId);

    return await db.runTransaction(async transaction => {
      // 사용자, 객실 확인
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      const roomDoc = await transaction.get(roomRef);
      if (!roomDoc.exists) {
        return {
          success: false,
          message: '객실을 찾을 수 없습니다.',
        };
      }

      const userData = userDoc.data();
      const roomData = roomDoc.data();

      // 호텔에 예약 반영
      const hotelUid = roomData.hotel_uid;
      if (!hotelUid) {
        return {
          success: false,
          message: '객실에 연결된 호텔 정보를 찾을 수 없습니다.',
        };
      }

      // 호텔 문서 참조
      const hotelRef = db.collection('hotels').doc(hotelUid);
      const hotelDoc = await transaction.get(hotelRef);

      if (!hotelDoc.exists) {
        return {
          success: false,
          message: '호텔 정보를 찾을 수 없습니다.',
        };
      }

      const hotelData = hotelDoc.data();

      // 날짜 검증
      const checkInDate = new Date(userInput.checkIn);
      const checkOutDate = new Date(userInput.checkOut);

      const reservationDates = [];
      const tempDate = new Date(checkInDate);

      while (tempDate < checkOutDate) {
        reservationDates.push(tempDate.toISOString().split('T')[0]);
        tempDate.setDate(tempDate.getDate() + 1);
      }

      const reservationsQuery = db
        .collection('reservations')
        .where('roomId', '==', roomId)
        .where('status', '==', 'confirmed');

      const reservationsSnapshot = await transaction.get(reservationsQuery);

      for (const doc of reservationsSnapshot.docs) {
        const reservation = doc.data();
        const existingCheckIn = new Date(reservation.checkIn);
        const existingCheckOut = new Date(reservation.checkOut);

        if (
          (checkInDate < existingCheckOut && checkOutDate > existingCheckIn)
          || (existingCheckIn < checkOutDate && existingCheckOut > checkInDate)
        ) {
          return {
            success: false,
            message: '선택한 날짜에 이미 예약이 있습니다.',
          };
        }
      }

      // 포인트 검증
      const currentPoints =
        typeof userData.points === 'number' ? userData.points : 0;
      const usePoints = userInput.point || 0;

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

      const reservationId = `${user.uid}_${currentTimestamp}`;
      const finalPaymentAmount = userInput.paymentAmount - usePoints;

      // 사용자 collections에 포인트 업데이트
      if (usePoints > 0) {
        transaction.update(userRef, {
          points: currentPoints - usePoints,
          updatedAt: serverTimestamp,
        });
      }

      // 예약 생성
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
        checkIn: checkIn,
        checkOut: checkOut,
        agreement: userInput.agreement,
        transactionId: transactionId,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
      };

      transaction.set(reservationRef, reservationData);

      // 객실에 예약 정보 추가
      const roomReservedDates = roomData.reservedDates || {};

      const updatedReservedDates = { ...roomReservedDates };
      reservationDates.forEach(date => {
        updatedReservedDates[date] = true;
      });

      transaction.update(roomRef, {
        reservedDates: updatedReservedDates,
        updatedAt: serverTimestamp,
      });

      // 동일한 호텔의 모든 rooms 확인
      const roomsQuery = db
        .collection('rooms')
        .where('hotel_uid', '==', hotelUid);

      const roomsSnapshot = await transaction.get(roomsQuery);

      //
      const dateAvailability = {};

      // 모든 예약 상태 확인
      for (const date of reservationDates) {
        let availableRoomCount = 0;

        for (const roomDoc of roomsSnapshot.docs) {
          const currentRoom = roomDoc.data();
          const roomReservedDates = currentRoom.reservedDates || {};

          if (!roomReservedDates[date]) {
            availableRoomCount++;
          }
        }

        dateAvailability[date] = availableRoomCount;
      }

      // 'availability' collections에 추가
      const availabilityRef = db.collection('availability').doc(hotelUid);
      const availabilityDoc = await transaction.get(availabilityRef);

      if (availabilityDoc.exists) {
        const currentAvailability = availabilityDoc.data().dates || {};
        const updatedAvailability = { ...currentAvailability };

        for (const [date, count] of Object.entries(dateAvailability)) {
          updatedAvailability[date] = count;
        }

        transaction.update(availabilityRef, {
          dates: updatedAvailability,
          updatedAt: serverTimestamp,
        });
      } else {
        transaction.set(availabilityRef, {
          hotelUid: hotelUid,
          dates: dateAvailability,
          createdAt: serverTimestamp,
          updatedAt: serverTimestamp,
        });
      }

      // search_index에 추가
      const datesWithNoAvailability = Object.entries(dateAvailability)
        .filter(([count]) => count === 0)
        .map(([date]) => date);

      if (datesWithNoAvailability.length > 0) {
        const searchIndexRef = db.collection('search_index').doc(hotelUid);
        const searchIndexDoc = await transaction.get(searchIndexRef);

        if (searchIndexDoc.exists) {
          const currentReservedDates =
            searchIndexDoc.data().reservedDates || [];
          const updatedReservedDates = [
            ...new Set([...currentReservedDates, ...datesWithNoAvailability]),
          ];

          transaction.update(searchIndexRef, {
            reservedDates: updatedReservedDates,
            updatedAt: serverTimestamp,
          });
        } else {
          transaction.set(searchIndexRef, {
            hotelUid: hotelUid,
            hotelName: hotelData.name || '',
            location: hotelData.location || '',
            category: hotelData.category || '',
            reservedDates: datesWithNoAvailability,
            createdAt: serverTimestamp,
            updatedAt: serverTimestamp,
          });
        }
      }

      // 포인트 사용 내역 기록
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

      // 결제 트랜잭션
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
