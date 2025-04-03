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

const updateHotelMinPrices = async () => {
  try {
    const hotelsCollection = collection(db, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCollection);
    let totalHotels = 0;
    let totalHotelsUpdated = 0;
    const updatePromises = [];

    hotelSnapshot.forEach(hotelDoc => {
      const hotelData = hotelDoc.data();
      const hotelRef = doc(db, 'hotels', hotelDoc.id);
      totalHotels++;

      if (
        !hotelData.rooms
        || !Array.isArray(hotelData.rooms)
        || hotelData.rooms.length === 0
      ) {
        updatePromises.push(
          updateDoc(hotelRef, { min_price: 0 }).then(() => {
            totalHotelsUpdated++;
            console.log(
              `호텔 업데이트 완료: ${hotelDoc.id}, min_price: 0 (rooms 없음)`,
            );
          }),
        );
        return;
      }

      const prices = hotelData.rooms
        .map(room => {
          const parseStringPrice = value => {
            if (typeof value === 'string') {
              return parseFloat(value.replace(/,/g, '')) || 0;
            }
            return value || 0;
          };

          const price = parseStringPrice(room.price);
          const priceFinal = parseStringPrice(room.price_final);

          if (price === 0 && priceFinal === 0) {
            return 0;
          }

          if (price === 0) return priceFinal;
          if (priceFinal === 0) return price;
          return Math.min(price, priceFinal);
        })
        .filter(price => price > 0); // 0보다 큰 값만 필터링

      const minPrice = prices.length === 0 ? 0 : Math.min(...prices);

      const currentMinPrice =
        typeof hotelData.min_price === 'string'
          ? parseFloat(hotelData.min_price.replace(/,/g, '')) || 0
          : hotelData.min_price || 0;

      if (currentMinPrice !== minPrice) {
        updatePromises.push(
          updateDoc(hotelRef, { min_price: minPrice }).then(() => {
            totalHotelsUpdated++;
            console.log(
              `호텔 업데이트 완료: ${hotelDoc.id}, min_price: ${minPrice} (기존: ${currentMinPrice})`,
            );
          }),
        );
      } else {
        console.log(
          `호텔 스킵: ${hotelDoc.id}, min_price 변동 없음 (${minPrice})`,
        );
      }
    });

    await Promise.all(updatePromises);
    console.log(
      `작업 완료: ${totalHotels}개 호텔 중 ${totalHotelsUpdated}개 호텔 min_price 업데이트됨`,
    );
  } catch (error) {
    console.error('호텔 최저가격 업데이트 중 오류 발생:', error);
  }
};

updateHotelMinPrices();
