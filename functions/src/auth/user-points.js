import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const STARTING_POINT = 1000000;

export const giveSignupPointsHandler = async user => {
  try {
    const userId = user.uid;
    const signupBonus = STARTING_POINT;

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

    return null;
  } catch (error) {
    console.error('포인트 지급 중 오류 발생:', error);
    return null;
  }
};
