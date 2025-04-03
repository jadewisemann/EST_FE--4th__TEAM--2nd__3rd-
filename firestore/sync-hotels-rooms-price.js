import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
};

const syncHotelPricesToRooms = async () => {
  try {
    console.log('호텔 가격 동기화 시작...');
    const db = initializeFirebase();

    const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
    console.log(`${hotelsSnapshot.size}개의 호텔을 찾았습니다.`);

    // 업데이트할 작업 수집
    const operations = [];
    let totalRooms = 0;
    let updatedRooms = 0;

    // 각 호텔 문서 처리
    for (const hotelDoc of hotelsSnapshot.docs) {
      const hotelData = hotelDoc.data();
      const hotelId = hotelDoc.id;
      const hotelTitle = hotelData.title || '제목 없음';

      if (!hotelData.rooms || !Array.isArray(hotelData.rooms)) {
        console.log(
          `호텔 '${hotelTitle}' (${hotelId})에 rooms 배열이 없습니다.`,
        );
        continue;
      }

      console.log(
        `호텔 '${hotelTitle}' (${hotelId}) 처리 중... 객실 수: ${hotelData.rooms.length}`,
      );
      totalRooms += hotelData.rooms.length;

      for (const room of hotelData.rooms) {
        if (room.room_uid) {
          const roomRef = doc(db, 'rooms', room.room_uid);
          const roomDoc = await getDoc(roomRef);

          if (roomDoc.exists()) {
            const roomData = roomDoc.data();

            const needsUpdate =
              !roomData.price
              || !roomData.price_final
              || roomData.price !== room.price
              || roomData.price_final !== room.price_final;

            if (needsUpdate) {
              operations.push({
                type: 'updateRoom',
                docId: room.room_uid,
                data: {
                  price: room.price,
                  price_final: room.price_final,
                  updated_at: serverTimestamp(),
                },
              });
              updatedRooms++;
            }
          } else {
            console.log(
              `경고: rooms 컬렉션에 ${room.room_uid} 문서가 존재하지 않습니다.`,
            );
          }
        }
      }
    }

    console.log(`${operations.length}개의 객실 가격 업데이트 작업 실행 중...`);
    if (operations.length > 0) {
      await executeFirestoreOperations(db, operations);
    }

    console.log(
      `가격 동기화 완료: 총 ${totalRooms}개 객실 중 ${updatedRooms}개 가격 업데이트됨`,
    );
    return updatedRooms;
  } catch (error) {
    console.error('가격 동기화 중 오류 발생:', error);
    throw error;
  }
};

const executeFirestoreOperations = async (db, operations) => {
  const BATCH_SIZE = 450;
  const batches = [];

  // 배치 그룹으로 나누기
  for (let i = 0; i < operations.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const operationChunk = operations.slice(i, i + BATCH_SIZE);

    operationChunk.forEach(operation => {
      if (operation.type === 'updateRoom') {
        const roomRef = doc(db, 'rooms', operation.docId);
        batch.update(roomRef, operation.data);
      }
    });

    batches.push(batch);
  }

  // 모든 배치 실행
  const results = [];
  for (let i = 0; i < batches.length; i++) {
    console.log(`배치 ${i + 1}/${batches.length} 실행 중...`);
    results.push(await batches[i].commit());
  }

  return results;
};

syncHotelPricesToRooms()
  .then(count => console.log(`작업 완료: ${count}개 객실 가격 업데이트됨`))
  .catch(err => console.error('오류:', err));

export { syncHotelPricesToRooms };
