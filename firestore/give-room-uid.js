import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
};

const generateNumericId = () =>
  Math.floor(100000000000 + Math.random() * 900000000000).toString();

const generateUniqueId = usedIds => {
  let id;
  do {
    id = generateNumericId();
  } while (usedIds.has(id));
  return id;
};

const addUidToRoom = (room, hotelId, hotelTitle, usedIds) => {
  const roomUid = generateUniqueId(usedIds);
  usedIds.add(roomUid);

  return {
    updatedRoom: { ...room, rooms_uid: roomUid },
    roomDoc: {
      docId: roomUid,
      data: {
        ...room,
        hotel_title: hotelTitle,
        hotel_uid: hotelId,
      },
    },
  };
};

const processHotel = (hotelDoc, usedIds) => {
  const hotelData = hotelDoc.data();
  const hotelId = hotelDoc.id;
  const hotelTitle = hotelData.title || '제목 없음';

  if (!hotelData.rooms || !Array.isArray(hotelData.rooms)) {
    console.log(`호텔 ${hotelId}에 rooms 배열이 없습니다.`);
    return null;
  }

  console.log(
    `호텔 '${hotelTitle}' (${hotelId}) 처리 중... 객실 수: ${hotelData.rooms.length}`,
  );

  const processedRooms = hotelData.rooms.map(room =>
    addUidToRoom(room, hotelId, hotelTitle, usedIds),
  );

  return {
    hotelId,
    hotelTitle,
    updatedRooms: processedRooms.map(item => item.updatedRoom),
    roomDocs: processedRooms.map(item => item.roomDoc),
  };
};

const createUpdateOperations = processedHotels => {
  const operations = [];

  processedHotels.forEach(hotel => {
    if (!hotel) return;

    operations.push({
      type: 'updateHotel',
      docId: hotel.hotelId,
      data: { rooms: hotel.updatedRooms },
    });

    hotel.roomDocs.forEach(roomDoc => {
      operations.push({
        type: 'createRoom',
        docId: roomDoc.docId,
        data: roomDoc.data,
      });
    });
  });

  return operations;
};

const executeFirestoreOperations = async (db, operations) => {
  const updatePromises = operations.map(operation => {
    if (operation.type === 'updateHotel') {
      return updateDoc(doc(db, 'hotels', operation.docId), operation.data);
    } else if (operation.type === 'createRoom') {
      return setDoc(doc(db, 'rooms', operation.docId), operation.data);
    }
  });

  return Promise.all(updatePromises);
};

const fetchHotels = async db => {
  const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
  console.log(`${hotelsSnapshot.size}개의 호텔을 찾았습니다.`);
  return hotelsSnapshot.docs;
};

const restructureHotelsAndRooms = async () => {
  try {
    const db = initializeFirebase();
    const usedIds = new Set();

    const hotelDocs = await fetchHotels(db);

    const processedHotels = hotelDocs.map(hotelDoc =>
      processHotel(hotelDoc, usedIds),
    );

    const operations = createUpdateOperations(
      processedHotels.filter(hotel => hotel !== null),
    );

    const totalHotels = processedHotels.filter(hotel => hotel !== null).length;
    const totalRooms = operations.filter(op => op.type === 'createRoom').length;

    console.log(`${operations.length}개의 작업 실행 중...`);
    await executeFirestoreOperations(db, operations);

    console.log(
      `작업 완료: ${totalHotels}개 호텔의 ${totalRooms}개 객실 처리됨`,
    );
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

restructureHotelsAndRooms();
