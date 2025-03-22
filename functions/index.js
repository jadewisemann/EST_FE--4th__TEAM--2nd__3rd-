/* eslint-disable */
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');

admin.initializeApp();

const STARTING_POINT = 1000000;
exports.giveSignupPoints = functions
  .region('asia-northeast3')
  .auth.user()
  .onCreate(async user => {
    try {
      const userId = user.uid;
      const signupBonus = STARTING_POINT;

      const userRef = admin.firestore().collection('users').doc(userId);

      await userRef.set({
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        points: signupBonus,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const pointHistoryRef = admin.firestore().collection('pointHistory');
      await pointHistoryRef.add({
        userId: userId,
        amount: signupBonus,
        type: 'signup_bonus',
        description: '회원가입 보너스 포인트',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `사용자 ${userId}에게 회원가입 보너스 ${signupBonus} 포인트가 지급되었습니다.`,
      );
      return null;
    } catch (error) {
      console.error('포인트 지급 중 오류 발생:', error);
      return null;
    }
  });

exports.addPointsToUser = functions
  .region('asia-northeast3')
  .https.onCall(async (data, context) => {
    // 관리자 권한 확인
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        '인증이 필요합니다.',
      );
    }

    const adminChecking = await admin
      .firestore()
      .collection('admins')
      .doc(context.auth.uid)
      .get();
    if (!adminChecking.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '관리자 권한이 필요합니다.',
      );
    }

    const { userId, points, reason } = data;

    if (!userId || !points || points <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '유효한 사용자 ID와 포인트 값이 필요합니다.',
      );
    }

    try {
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          '해당 사용자를 찾을 수 없습니다.',
        );
      }

      await admin.firestore().runTransaction(async transaction => {
        const userSnapshot = await transaction.get(userRef);
        const userData = userSnapshot.data();
        const currentPoints = userData.points || 0;

        transaction.update(userRef, {
          points: currentPoints + points,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const pointHistoryRef = admin
          .firestore()
          .collection('pointHistory')
          .doc();
        transaction.set(pointHistoryRef, {
          userId: userId,
          amount: points,
          type: 'admin_grant',
          description: reason || '관리자에 의한 포인트 지급',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          adminId: context.auth.uid,
        });
      });

      return {
        success: true,
        message: `${points} 포인트가 사용자 ${userId}에게 성공적으로 지급되었습니다.`,
      };
    } catch (error) {
      console.error('포인트 추가 중 오류 발생:', error);
      throw new functions.https.HttpsError(
        'internal',
        '포인트 지급 중 오류가 발생했습니다.',
        error.message,
      );
    }
  });

const db = admin.firestore();

async function processPayment(userId, amount, reservationData) {
  try {
    const userRef = db.collection('users').doc(userId);
    
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);      
      if (!userDoc.exists) {
        console.log('사용자를 찾을 수 없음:', userId); // 디버깅용 로그
        return {
          success: false,
          message: "사용자를 찾을 수 없습니다."
        };
      }
      
      const userData = userDoc.data();
      console.log('사용자 데이터:', userData);
      
      let currentPoints = 0;
      if (typeof userData.points === 'number') {
        currentPoints = userData.points;
      } else if (typeof userData.point === 'number') {
        currentPoints = userData.point;
      }
      
      console.log('현재 포인트:', currentPoints, '필요 포인트:', amount); // 디버깅용 로그
      
      if (currentPoints < amount) {
        return {
          success: false,
          message: "포인트가 부족합니다.",
          currentPoints: currentPoints,
          requiredPoints: amount
        };
      }
      
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      
      transaction.update(userRef, {
        points: currentPoints - amount,
        updatedAt: timestamp
      });
      
      const reservationId = `${userId}_${Date.now()}`;
      const reservationRef = db.collection('reservations').doc(reservationId);
      
      const completeReservationData = {
        userId: userId,
        amount: amount,
        paymentDate: timestamp,
        status: "confirmed",
        createdAt: timestamp,
        ...reservationData
      };
      
      transaction.set(reservationRef, completeReservationData);
      
      // 포인트 사용 내역 저장
      const pointHistoryRef = db.collection('pointHistory').doc();
      const pointHistoryData = {
        userId: userId,
        type: "use",
        amount: amount,
        remainingPoints: currentPoints - amount,
        description: `예약 결제 (예약 ID: ${reservationId})`,
        reservationId: reservationId,
        createdAt: timestamp,
        metadata: {
          reservationType: reservationData.type || "일반 예약",
          // TODO: 메타 데이터 추가가
        }
      };
      
      transaction.set(pointHistoryRef, pointHistoryData);
      
      // 트랜잭션 기록 저장
      const transactionRef = db.collection('transactions').doc(`${userId}_${Date.now()}`);
      transaction.set(transactionRef, {
        userId: userId,
        type: "payment",
        amount: amount,
        reservationId: reservationId,
        description: "예약 결제",
        createdAt: timestamp
      });
      
      return {
        success: true,
        message: "결제가 성공적으로 처리되었습니다.",
        reservationId: reservationId,
        remainingPoints: currentPoints - amount,
        reservation: completeReservationData
      };
    });
    
  } catch (error) {
    console.error("결제 처리 중 오류 발생:", error);
    
    return {
      success: false,
      message: "결제 처리 중 오류가 발생했습니다.",
      error: error.message
    };
  }
}

exports.payment = functions
  .region('asia-northeast3')
  .https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '이 기능을 사용하려면 로그인이 필요합니다.'
    );
  }

  const userId = context.auth.uid;
  const { amount, reservationData } = data;
  
  if (!amount || !reservationData) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '필수 정보가 누락되었습니다.'
    );
  }
  
  const result = await processPayment(userId, amount, reservationData);
  return result;
});

exports.paymentHttp = functions
  .region('asia-northeast3')
  .https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
  const { userId, amount, reservationData } = req.body;
  
  if (!userId || !amount || !reservationData) {
    res.status(400).json({
      success: false,
      message: "필수 정보가 누락되었습니다."
    });
    return;
  }
  
  const result = await processPayment(userId, amount, reservationData);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});