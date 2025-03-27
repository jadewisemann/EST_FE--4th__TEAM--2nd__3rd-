import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from './config';

/**
 * 사용자 문서를 가져오는 함수
 */
const getUserDoc = async userId => {
  if (!userId) throw new Error('사용자 ID가 필요합니다.');

  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error('사용자 문서가 존재하지 않습니다.');

  return { docRef, docSnap };
};

/**
 * 사용자의 위시리스트를 가져오는 함수
 */
export const getUserWishlist = async userId => {
  try {
    const { docSnap } = await getUserDoc(userId);
    return docSnap.data().likedList || [];
  } catch (error) {
    console.error('위시리스트 가져오기 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 위시리스트를 업데이트하는 함수
 */
export const updateUserWishlist = async (userId, wishlist) => {
  const safeWishlist = (wishlist || []).filter(
    item => item !== undefined && item !== null,
  );

  try {
    const { docRef } = await getUserDoc(userId);
    await updateDoc(docRef, { likedList: safeWishlist });
    return true;
  } catch (error) {
    console.error('위시리스트 업데이트 오류:', error);
    throw error;
  }
};
