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
