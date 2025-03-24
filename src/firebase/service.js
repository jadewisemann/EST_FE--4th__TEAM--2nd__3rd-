import { collection, query, where, getDocs } from 'firebase/firestore';

import { db } from './config';

export const reservationService = {
  getUserReservations: async userId => {
    if (!userId) throw new Error('사용자 ID가 필요합니다.');

    try {
      const reservationsRef = collection(db, 'reservations');

      const userReservationsQuery = query(
        reservationsRef,
        where('userId', '==', userId),
      );
      const querySnapshot = await getDocs(userReservationsQuery);

      const reservationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return reservationsData;
    } catch (error) {
      console.error('예약 정보 가져오기 오류:', error);
      throw error;
    }
  },
};
