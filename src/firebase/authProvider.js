import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';

import app from './config';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const listenAuthState = callback => onAuthStateChanged(auth, callback);

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  return { user };
};

export const logout = () => signOut(auth);

export const resetPassword = email => sendPasswordResetEmail(auth, email);

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;

    if (!user) throw new Error('사용자가 로그인 되어 있지 않습니다.');

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true, message: '비밀번호가 성곡적으로 변경되었습니다.' };
  } catch (error) {
    let errorMessage = '비밀번호 변경 중 오류가 발생했습니다.';

    if (error.code === 'auth/wrong-password') {
      errorMessage = '현재 비밀번호가 올바르지 않습니다.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '새 비밀번호는 최소 6자 이상이어야 합니다.';
    } else if (error.code === 'auth/requires-recent-login') {
      errorMessage = '보안을 위해 다시 로그인해주세요.';
    }

    return { success: false, message: errorMessage, error };
  }
};

export const handleResetPasswordEmail = async (actionCode, newPassword) => {
  try {
    await verifyPasswordResetCode(auth, actionCode);
    await confirmPasswordReset(auth, actionCode, newPassword);
    return {
      success: true,
      message: '비밀번호가 성공적으로 재설정되었습니다.',
    };
  } catch (error) {
    let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.';

    if (error.code === 'auth/expired-action-code') {
      errorMessage =
        '링크가 만료되었습니다. 다시 비밀번호 재설정을 요청해주세요.';
    } else if (error.code === 'auth/invalid-action-code') {
      errorMessage =
        '유효하지 않은 링크입니다. 다시 비밀번호 재설정을 요청해주세요.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '새 비밀번호는 최소 6자 이상이어야 합니다.';
    }

    return { success: false, message: errorMessage, error };
  }
};
