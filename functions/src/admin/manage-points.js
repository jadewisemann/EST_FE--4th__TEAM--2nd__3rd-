import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v1';

export const addPointsToUserHandler = async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '인증이 필요합니다.',
    );
  }

  const db = getFirestore();

  const adminChecking = await db
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
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        '해당 사용자를 찾을 수 없습니다.',
      );
    }

    await db.runTransaction(async transaction => {
      const userSnapshot = await transaction.get(userRef);
      const userData = userSnapshot.data();
      const currentPoints = userData.points || 0;

      transaction.update(userRef, {
        points: currentPoints + points,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const pointHistoryRef = db.collection('pointHistory').doc();

      transaction.set(pointHistoryRef, {
        userId: userId,
        amount: points,
        type: 'admin_grant',
        description: reason || '관리자에 의한 포인트 지급',
        createdAt: FieldValue.serverTimestamp(),
        adminId: context.auth.uid,
      });
    });

    return {
      success: true,
      message: `${points} 포인트가 사용자 ${userId}에게 성공적으로 지급되었습니다.`,
    };
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      '포인트 지급 중 오류가 발생했습니다.',
      error.message,
    );
  }
};
