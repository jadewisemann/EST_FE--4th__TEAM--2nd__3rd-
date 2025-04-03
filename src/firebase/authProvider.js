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

export const resetPassword = async email => {
  try {
    await sendPasswordResetEmail(
      auth,
      email || auth.currentUser ? auth.currentUser.email : null,
    );

    return {
      success: true,
      message: '비밀번호 재설정 이메일이 전송되었습니다.',
    };
  } catch (error) {
    let errorMessage = '비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.';

    if (error.code === 'auth/network-request-failed') {
      errorMessage = '네트워크 연결을 확인해주세요.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = '해당 이메일로 등록된 사용자가 없습니다.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '유효하지 않은 이메일 주소입니다.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage =
        '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    return { success: false, message: errorMessage, error };
  }
};

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
    return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
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
