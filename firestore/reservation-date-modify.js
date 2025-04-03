// Firebase 초기화 및 Firestore 참조 설정
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formatDateToFullYear = dateString => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{2})$/;
  const match = dateString.match(dateRegex);

  if (match) {
    const [, yy, mm, dd] = match;
    const fullYear = `20${yy}`;
    return `${fullYear}-${mm}-${dd}`;
  }

  return dateString;
};

const updateDateFormats = async () => {
  try {
    const reservationsCollection = collection(db, 'reservations');
    const reservationSnapshot = await getDocs(reservationsCollection);

    let updateCount = 0;
    const updatePromises = [];

    reservationSnapshot.forEach(reservationDoc => {
      const reservationData = reservationDoc.data();
      let needsUpdate = false;
      const updatedData = {};

      if (
        reservationData.checkIn
        && typeof reservationData.checkIn === 'string'
      ) {
        const formattedCheckIn = formatDateToFullYear(reservationData.checkIn);
        if (formattedCheckIn !== reservationData.checkIn) {
          updatedData.checkIn = formattedCheckIn;
          needsUpdate = true;
        }
      }

      if (
        reservationData.checkOut
        && typeof reservationData.checkOut === 'string'
      ) {
        const formattedCheckOut = formatDateToFullYear(
          reservationData.checkOut,
        );
        if (formattedCheckOut !== reservationData.checkOut) {
          updatedData.checkOut = formattedCheckOut;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        const reservationRef = doc(db, 'reservations', reservationDoc.id);
        updatePromises.push(updateDoc(reservationRef, updatedData));
        updateCount++;
      }
    });

    await Promise.all(updatePromises);

    console.log(
      `총 ${updateCount}개의 예약 문서의 날짜 형식이 업데이트되었습니다.`,
    );
  } catch (error) {
    console.error('날짜 형식 업데이트 중 오류 발생:', error);
  }
};

updateDateFormats();
