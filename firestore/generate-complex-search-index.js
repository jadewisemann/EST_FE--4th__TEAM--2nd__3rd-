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

const convertPriceToNumber = price => {
  if (typeof price === 'number') return price;
  if (!price) return 0;

  return parseInt(price.replace(/,/g, ''), 10);
};

const generateCombinedNgrams = (text, minSize = 2, maxSize = 3) => {
  if (!text || typeof text !== 'string') return {};

  // 텍스트 정규화
  const normalizedText = text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .trim();

  if (!normalizedText) return {};

  const ngramsObj = {};

  ngramsObj[normalizedText] = true;

  const words = normalizedText.split(/\s+/).filter(Boolean);

  words.forEach(word => {
    if (word.length >= minSize) {
      ngramsObj[word] = true;
    }
  });

  // 연속된 단어 조합
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    for (let size = minSize; size <= Math.min(maxSize, word.length); size++) {
      for (let j = 0; j <= word.length - size; j++) {
        const ngram = word.substring(j, j + size);
        ngramsObj[ngram] = true;
      }
    }

    if (i < words.length - 1) {
      const combinedWords = words[i] + ' ' + words[i + 1];
      ngramsObj[combinedWords] = true;
    }
  }

  return ngramsObj;
};

const createHotelSearchIndex = async () => {
  try {
    const hotelsCollection = collection(db, 'hotels');
    const hotelSnapshot = await getDocs(hotelsCollection);

    let totalHotels = 0;
    let totalIndicesCreated = 0;
    const indexingPromises = [];

    hotelSnapshot.forEach(hotelDoc => {
      const hotelData = hotelDoc.data();
      totalHotels++;

      const hotelId = hotelDoc.id;
      const title = hotelData.title || '';
      const location = hotelData.location[0] || '';
      const region = (hotelData.region || '').toLowerCase();
      const minPrice = convertPriceToNumber(hotelData.min_price);
      const rating =
        typeof hotelData.rating === 'number' ? hotelData.rating : 0;

      const titleNgrams = generateCombinedNgrams(title);
      const locationNgrams = generateCombinedNgrams(location);

      const combined_ngrams = { ...titleNgrams, ...locationNgrams };

      const searchIndexDoc = {
        hotel_id: hotelId,
        title: title,
        location: location,
        region: region,
        min_price: minPrice,
        rating: rating,
        combined_ngrams: combined_ngrams,
        title_ngram: titleNgrams,
        location_ngram: locationNgrams,
        created_at: new Date(),
      };

      indexingPromises.push(
        setDoc(doc(db, 'search_index_complex', hotelId), searchIndexDoc).then(
          () => {
            totalIndicesCreated++;
            console.log(
              `인덱스 생성 완료: ${hotelId}, 제목: ${title}, 위치: ${location}`,
            );
          },
        ),
      );
    });

    await Promise.all(indexingPromises);
    console.log(
      `작업 완료: ${totalHotels}개 호텔, ${totalIndicesCreated}개 검색 인덱스 생성됨`,
    );

    console.log('\n검색 인덱스 사용 방법:');
  } catch (error) {
    console.error('검색 인덱스 생성 중 오류 발생:', error);
  }
};

// 실행
createHotelSearchIndex();
