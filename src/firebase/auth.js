import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
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
