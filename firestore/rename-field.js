import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
};

const fetchHotels = async db => {
  const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
  console.log(`${hotelsSnapshot.size}개의 호텔을 찾았습니다.`);
  return hotelsSnapshot.docs;
};

const renameRoomUidField = room => {
  if (room.rooms_uid) {
    const updatedRoom = { ...room, room_uid: room.rooms_uid };
    delete updatedRoom.rooms_uid;
    return updatedRoom;
  }
  return room;
};

const processHotel = hotelDoc => {
  const hotelData = hotelDoc.data();
  const hotelId = hotelDoc.id;
  const hotelTitle = hotelData.title || '제목 없음';

  if (!hotelData.rooms || !Array.isArray(hotelData.rooms)) {
    console.log(`호텔 ${hotelId}에 rooms 배열이 없습니다.`);
    return null;
  }

  const updatedRooms = hotelData.rooms.map(renameRoomUidField);

  console.log(
    `호텔 '${hotelTitle}' (${hotelId}): ${hotelData.rooms.length}개 객실의 필드명 변경 처리 중`,
  );

  return {
    hotelId,
    updatedRooms,
  };
};

const processBatches = async (db, hotels) => {
  const MAX_BATCH_SIZE = 500;
  const batches = [];

  let currentBatch = writeBatch(db);
  let operationCount = 0;

  hotels.forEach(hotel => {
    if (!hotel) return;

    const hotelRef = doc(db, 'hotels', hotel.hotelId);
    currentBatch.update(hotelRef, { rooms: hotel.updatedRooms });
    operationCount++;

    if (operationCount >= MAX_BATCH_SIZE) {
      batches.push(currentBatch);
      currentBatch = writeBatch(db);
      operationCount = 0;
    }
  });

  if (operationCount > 0) {
    batches.push(currentBatch);
  }

  console.log(`총 ${batches.length}개의 배치로 작업 실행 중...`);

  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`배치 ${i + 1}/${batches.length} 완료`);
  }
};

const renameRoomsUidToRoomUid = async () => {
  try {
    const db = initializeFirebase();

    const hotelDocs = await fetchHotels(db);

    const processedHotels = hotelDocs
      .map(processHotel)
      .filter(hotel => hotel !== null);

    const totalHotels = processedHotels.length;
    const totalRooms = processedHotels.reduce(
      (total, hotel) => total + hotel.updatedRooms.length,
      0,
    );

    console.log(
      `총 ${totalHotels}개 호텔의 ${totalRooms}개 객실 필드명을 변경합니다.`,
    );

    await processBatches(db, processedHotels);

    console.log(
      `작업 완료: ${totalHotels}개 호텔의 ${totalRooms}개 객실의 'rooms_uid'를 'room_uid'로 변경함`,
    );
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

renameRoomsUidToRoomUid();
