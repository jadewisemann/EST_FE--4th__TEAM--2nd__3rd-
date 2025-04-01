import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateRoomTitles = async () => {
  try {
    const hotelsCollection = collection(db, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCollection);

    let totalHotels = 0;
    let totalRoomsUpdated = 0;
    const updatePromises = [];

    hotelSnapshot.forEach(hotelDoc => {
      const hotelData = hotelDoc.data();

      if (hotelData.rooms && Array.isArray(hotelData.rooms)) {
        totalHotels++;

        hotelData.rooms.forEach(room => {
          if (room.room_uid && room.title) {
            const roomRef = doc(db, 'rooms', room.room_uid);

            updatePromises.push(
              setDoc(roomRef, { room_title: room.title }, { merge: true }).then(
                () => {
                  totalRoomsUpdated++;
                  console.log(
                    `룸 업데이트 완료: ${room.room_uid}, 제목: ${room.title}`,
                  );
                },
              ),
            );
          }
        });
      }
    });

    await Promise.all(updatePromises);

    console.log(
      `작업 완료: ${totalHotels}개 호텔, ${totalRoomsUpdated}개 룸 업데이트됨`,
    );
  } catch (error) {
    console.error('룸 제목 업데이트 중 오류 발생:', error);
  }
};

updateRoomTitles();
