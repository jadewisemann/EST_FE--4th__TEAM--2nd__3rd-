import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './config';

const ERR_MSG = {
  USER_ID_MISSING: '사용자 ID가 필요합니다.',
};

// general
export const getUserDoc = async uid => {
  if (!uid) throw new Error('사용자 ID가 필요합니다.');
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return { docSnap, docRef };
};

export const fetchUserData = async uid => {
  const { docSnap } = await getUserDoc(uid);
  return docSnap.data();
};

export const updateUserField = async (uid, field, value) => {
  const { docRef } = getUserDoc(uid);
  await updateDoc(docRef, { [field]: value });
  return true;
};

// wishlist
const WISHLIST_FIELD = 'likedList';

export const fetchWishlist = async uid => {
  try {
    const userData = await fetchUserData(uid);
    return userData?.[WISHLIST_FIELD] || [];
  } catch (error) {
    console.error('위시리스트 가져오기 오류:', error);
    throw error;
  }
};

export const updateWishlist = async (uid, wishlist) => {
  const safeWishlist = (wishlist || []).filter(
    item => item !== undefined && item !== null,
  );

  try {
    return await updateUserField(uid, WISHLIST_FIELD, safeWishlist);
  } catch (error) {
    console.error('위시리스트 업데이트 오류:', error);
    throw error;
  }
};

// reservation
const RESERVATION_FIELD = 'reservations';

export const fetchUserReservations = async uid => {
  if (!uid) throw new Error(ERR_MSG.USER_ID_MISSING);

  try {
    const reservationsRef = collection(db, RESERVATION_FIELD);
    const userReservationsQuery = query(
      reservationsRef,
      where('userId', '==', uid),
    );
    const querySnapshot = await getDocs(userReservationsQuery);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('예약 정보 가져오기 오류:', error);
    throw error;
  }
};
