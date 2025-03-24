import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// 시작 포인트 상수
const STARTING_POINT = 1000000;

/**
 * 회원가입 시 사용자에게 포인트를 지급하는 함수
 * @param {Object} user - 새로 생성된 사용자 객체
 * @returns {Promise<null>}
 */
export const giveSignupPointsHandler = async user => {
  try {
    const userId = user.uid;
    const signupBonus = STARTING_POINT;
    // 함수 호출 시점에 db 인스턴스 가져오기
    const db = getFirestore();

    const userRef = db.collection('users').doc(userId);

    await userRef.set({
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      points: signupBonus,
      createdAt: FieldValue.serverTimestamp(),
    });

    const pointHistoryRef = db.collection('pointHistory');
    await pointHistoryRef.add({
      userId: userId,
      amount: signupBonus,
      type: 'signup_bonus',
      description: '회원가입 보너스 포인트',
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(
      `사용자 ${userId}에게 회원가입 보너스 ${signupBonus} 포인트가 지급되었습니다.`,
    );
    return null;
  } catch (error) {
    console.error('포인트 지급 중 오류 발생:', error);
    return null;
  }
};
