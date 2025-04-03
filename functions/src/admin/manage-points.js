import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v1';

/**
 * 관리자가 사용자에게 포인트를 추가하는 함수
 * @param {Object} data - 요청 데이터 (userId, points, reason)
 * @param {Object} context - 인증 컨텍스트
 * @returns {Promise<Object>} 성공 메시지와 함께 결과 반환
 */
export const addPointsToUserHandler = async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '인증이 필요합니다.',
    );
  }

  // 함수 호출 시점에 db 인스턴스 가져오기
  const db = getFirestore();

  // 관리자 권한 확인
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

  // 유효성 검사
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

    // 트랜잭션으로 포인트 추가
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
    console.error('포인트 추가 중 오류 발생:', error);
    throw new functions.https.HttpsError(
      'internal',
      '포인트 지급 중 오류가 발생했습니다.',
      error.message,
    );
  }
};
