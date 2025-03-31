// Firebase 초기화 및 Firestore 참조 설정
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateRandomPrice = () => {
  const basePrice = Math.floor(Math.random() * 6) + 5;
  return basePrice * 10000;
};

const updateEmptyPrices = async () => {
  try {
    const hotelsCollection = collection(db, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCollection);

    const updatePromises = [];

    hotelSnapshot.forEach(hotelDoc => {
      const hotelData = hotelDoc.data();
      let needsUpdate = false;

      if (hotelData.rooms && Array.isArray(hotelData.rooms)) {
        hotelData.rooms.forEach((room, index) => {
          if (!room.price) {
            hotelData.rooms[index].price = generateRandomPrice();
            needsUpdate = true;
          }
        });

        if (needsUpdate) {
          const hotelRef = doc(db, 'hotels', hotelDoc.id);
          updatePromises.push(updateDoc(hotelRef, { rooms: hotelData.rooms }));
        }
      }
    });

    await Promise.all(updatePromises);
    console.log(
      `총 ${updatePromises.length}개의 호텔 문서가 업데이트되었습니다.`,
    );
  } catch (error) {
    console.error('가격 업데이트 중 오류 발생:', error);
  }
};

updateEmptyPrices();
