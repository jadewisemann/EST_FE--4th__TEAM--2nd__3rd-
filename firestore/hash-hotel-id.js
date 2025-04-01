import crypto from 'crypto';
import * as fs from 'fs';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const backupCollections = async () => {
  try {
    const collectionsToBackup = ['hotels', 'search_index'];
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFolder = `backup_${timestamp}`;

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder);
    }

    for (const collectionName of collectionsToBackup) {
      console.log(`"${collectionName}" 컬렉션 백업 중...`);

      const querySnapshot = await getDocs(collection(db, collectionName));

      const backupData = [];

      querySnapshot.forEach(doc => {
        backupData.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      const fileName = `${backupFolder}/backup_${collectionName}.json`;

      fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));

      console.log(`${collectionName} 백업 완료! 파일명: ${fileName}`);
      console.log(`총 ${backupData.length}개의 문서가 백업되었습니다.`);
    }

    return backupFolder;
  } catch (error) {
    console.error(`백업 중 오류 발생:`, error);
    throw error;
  }
};

const getPrefixFromHash = docId => {
  const hash = crypto.createHash('md5').update(docId).digest('hex');
  return hash.slice(-4);
};

const generateBetterUid = docId => {
  const prefix = getPrefixFromHash(docId);

  const fullTimestamp = new Date().getTime().toString();
  const timestampPart = fullTimestamp.slice(-9, -4);

  const random = Math.floor(1000 + Math.random() * 9000);

  return prefix + timestampPart + random;
};

const migrateHotelsWithSearchIndex = async () => {
  try {
    console.log('데이터 백업 시작...');
    const backupFolder = await backupCollections();
    console.log(`백업 완료. 폴더: ${backupFolder}`);

    console.log('hotels 컬렉션 데이터 로드 중...');
    const hotelsSnapshot = await getDocs(collection(db, 'hotels'));

    const migrationMap = new Map();
    const usedUids = new Set();

    for (const hotelDoc of hotelsSnapshot.docs) {
      const originalId = hotelDoc.id;

      let newUid;
      do {
        newUid = generateBetterUid(originalId);
      } while (usedUids.has(newUid));

      usedUids.add(newUid);

      migrationMap.set(originalId, {
        newUid: newUid,
        hotelData: hotelDoc.data(),
      });
    }

    console.log(
      `매핑 정보 생성 완료. ${migrationMap.size}개의 hotels 문서를 마이그레이션합니다.`,
    );

    const mappingLogFile = `${backupFolder}/migration_mapping.json`;
    fs.writeFileSync(
      mappingLogFile,
      JSON.stringify(Array.from(migrationMap.entries()), null, 2),
    );
    console.log(`매핑 정보가 ${mappingLogFile}에 저장되었습니다.`);

    console.log('hotels 컬렉션 마이그레이션 시작...');
    const hotelMigrationPromises = [];

    for (const [originalId, migrationInfo] of migrationMap.entries()) {
      const { newUid, hotelData } = migrationInfo;

      const updatedHotelData = {
        ...hotelData,
        uid: newUid,
        originalUid: originalId,
      };

      const createPromise = setDoc(
        doc(db, 'hotels', newUid),
        updatedHotelData,
      ).then(() =>
        console.log(`새 hotels 문서 생성: ${newUid} (원본: ${originalId})`),
      );

      hotelMigrationPromises.push(createPromise);
    }

    await Promise.all(hotelMigrationPromises);
    console.log('모든 새 hotels 문서 생성 완료');

    console.log('search_index 컬렉션 마이그레이션 시작...');
    const searchIndexPromises = [];

    for (const [originalId, migrationInfo] of migrationMap.entries()) {
      const { newUid } = migrationInfo;

      const searchIndexDocRef = doc(db, 'search_index', originalId);
      const searchIndexDoc = await getDoc(searchIndexDocRef);

      if (searchIndexDoc.exists()) {
        const searchData = searchIndexDoc.data();

        const updatedSearchData = {
          ...searchData,
          hotel_id: newUid, // hotel_id 필드 업데이트
        };

        const createSearchPromise = setDoc(
          doc(db, 'search_index', newUid),
          updatedSearchData,
        ).then(() =>
          console.log(
            `새 search_index 문서 생성: ${newUid} (원본: ${originalId})`,
          ),
        );

        searchIndexPromises.push(createSearchPromise);
      }
    }

    await Promise.all(searchIndexPromises);
    console.log('모든 새 search_index 문서 생성 완료');

    console.log('원본 hotels 문서 삭제 시작...');
    const deleteHotelPromises = [];

    for (const originalId of migrationMap.keys()) {
      const deletePromise = deleteDoc(doc(db, 'hotels', originalId)).then(() =>
        console.log(`원본 hotels 문서 삭제: ${originalId}`),
      );

      deleteHotelPromises.push(deletePromise);
    }

    await Promise.all(deleteHotelPromises);
    console.log('모든 원본 hotels 문서 삭제 완료');

    console.log('원본 search_index 문서 삭제 시작...');
    const deleteSearchPromises = [];

    for (const originalId of migrationMap.keys()) {
      const searchIndexDocRef = doc(db, 'search_index', originalId);
      const searchIndexDoc = await getDoc(searchIndexDocRef);

      if (searchIndexDoc.exists()) {
        const deletePromise = deleteDoc(searchIndexDocRef).then(() =>
          console.log(`원본 search_index 문서 삭제: ${originalId}`),
        );

        deleteSearchPromises.push(deletePromise);
      }
    }

    await Promise.all(deleteSearchPromises);
    console.log('모든 원본 search_index 문서 삭제 완료');

    console.log('마이그레이션이 성공적으로 완료되었습니다!');
    console.log(
      `백업 폴더 (${backupFolder})에 원본 데이터가 저장되어 있습니다.`,
    );
  } catch (error) {
    console.error('마이그레이션 중 오류 발생:', error);
    console.error('백업 데이터를 확인하고 필요한 경우 수동 복구를 진행하세요.');
  }
};

migrateHotelsWithSearchIndex();
