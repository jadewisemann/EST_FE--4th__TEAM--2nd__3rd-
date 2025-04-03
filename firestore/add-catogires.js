import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 문서 제목을 분석하여 적절한 카테고리를 결정하는 함수
 * @param {string} title - 문서의 제목
 * @returns {string} - 결정된 카테고리
 */
const determineCategory = title => {
  if (!title) return 'motel'; // 제목이 없는 경우 기본값은 모텔

  // 대소문자 구분 없이 검색하기 위해 소문자로 변환
  const lowerTitle = title.toLowerCase();

  // 특수 문자(&, +, - 등)를 제거하고 공백으로 바꿔서 단어 분리가 더 잘 되도록 함
  const normalizedTitle = lowerTitle
    .replace(/[&+\-_]/g, ' ')
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로 통일
    .trim();

  // 호텔 또는 리조트가 포함된 경우
  if (
    normalizedTitle.includes('호텔')
    || normalizedTitle.includes('hotel')
    || normalizedTitle.includes('리조트')
    || normalizedTitle.includes('resort')
  ) {
    return 'hotel';
  }

  // 펜션 또는 풀빌라가 포함된 경우 (스파&풀빌라, 스파 풀빌라, 스파+풀빌라, 샵앤플렛풀빌라펜션 등의 형태 포함)
  if (
    lowerTitle.includes('펜션')
    || lowerTitle.includes('pension')
    || lowerTitle.includes('풀빌라')
    || lowerTitle.includes('풀 빌라')
    || lowerTitle.includes('pool villa')
    || lowerTitle.includes('poolvilla')
    || normalizedTitle.includes('스파 풀') // 스파&풀빌라, 스파 풀빌라 등을 위한 추가 패턴
    || /스파.*풀빌라/.test(normalizedTitle) // 스파와 풀빌라 사이에 어떤 문자가 있어도 인식
    || /스파.*풀 빌라/.test(normalizedTitle)
    // 붙여쓰기된 형태도 인식하기 위한 추가 패턴
    || /풀빌라/.test(lowerTitle) // 원본 문자열에서 '풀빌라'가 포함된 모든 문자열 검사
    || /펜션/.test(lowerTitle) // 원본 문자열에서 '펜션'이 포함된 모든 문자열 검사
  ) {
    return 'pension';
  }

  // 위 조건에 해당하지 않는 경우
  return 'motel';
};

/**
 * search_index 컬렉션의 모든 문서를 처리하여 카테고리를 업데이트하는 함수
 */
const updateCategories = async () => {
  try {
    // search_index 컬렉션의 모든 문서 가져오기
    const searchIndexCollection = collection(db, 'search_index');
    const snapshot = await getDocs(searchIndexCollection);
    console.log(`총 ${snapshot.size}개의 문서를 처리합니다.`);

    let totalDocuments = 0;
    let totalDocumentsUpdated = 0;
    const updatePromises = [];
    const batchSize = 500; // Firestore 배치 제한
    let batch = writeBatch(db);
    let batchCount = 0;

    // 각 문서 처리
    snapshot.forEach(docSnapshot => {
      const data = docSnapshot.data();
      const title = data.title || '';
      const category = determineCategory(title);
      const currentCategory = data.category || '';

      totalDocuments++;

      // 카테고리가 변경된 경우에만 업데이트
      if (currentCategory !== category) {
        const docRef = doc(db, 'search_index', docSnapshot.id);
        // 배치에 업데이트 작업 추가
        batch.update(docRef, { category: category });
        totalDocumentsUpdated++;

        console.log(
          `문서 업데이트 예정: ${docSnapshot.id}, 카테고리: ${category} (기존: ${currentCategory || '없음'})`,
        );

        // 배치 크기가 제한에 도달하면 커밋
        if (totalDocumentsUpdated % batchSize === 0) {
          updatePromises.push(batch.commit());
          batch = writeBatch(db);
          batchCount++;
          console.log(
            `${batchCount}번째 배치 처리 중... (${totalDocumentsUpdated}/${totalDocuments})`,
          );
        }
      } else {
        console.log(
          `문서 스킵: ${docSnapshot.id}, 카테고리 변동 없음 (${category})`,
        );
      }
    });

    // 남은 문서 처리
    if (totalDocumentsUpdated % batchSize !== 0) {
      updatePromises.push(batch.commit());
      batchCount++;
    }

    // 모든 배치 커밋 완료 대기
    await Promise.all(updatePromises);

    console.log(
      `작업 완료: ${totalDocuments}개 문서 중 ${totalDocumentsUpdated}개 문서의 카테고리 업데이트됨`,
    );
  } catch (error) {
    console.error('카테고리 업데이트 중 오류 발생:', error);
  }
};

// 카테고리 업데이트 실행
updateCategories();
