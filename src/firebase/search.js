import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  limit as firestoreLimit,
  startAfter,
  orderBy,
} from 'firebase/firestore';

import { db } from './config';

const convertPriceToNumber = price => {
  if (typeof price === 'number') return price;
  if (!price) return 0;

  return parseInt(price.replace(/,/g, ''), 10);
};

/**
 * 호텔 가격 변환 함수
 * @param {object} hotel 호텔 객체
 * @returns {object} 가격이 변환된 호텔
 */
const convertHotelPrices = hotel => {
  if (!hotel) return null;

  // 호텔 객체 깊은 복사
  const convertedHotel = { ...hotel };

  // rooms가 있고, 배열인지 확인
  if (convertedHotel.rooms && Array.isArray(convertedHotel.rooms)) {
    // rooms를 순회
    convertedHotel.rooms = convertedHotel.rooms.map(room => {
      // price를 Number 타입으로 변환
      const numericPrice = convertPriceToNumber(room.price);
      const numericPriceFinal = room.price_final
        ? convertPriceToNumber(room.price_final)
        : '';
      // price, price_final을 비교하여 언제나 price가 더 높도록 순서 변경
      const [price, priceFinal] =
        numericPrice &&
        numericPriceFinal !== '' &&
        numericPriceFinal > numericPrice
          ? [numericPriceFinal, numericPrice]
          : [numericPrice, numericPriceFinal];

      return {
        ...room,
        price: price,
        price_final: priceFinal,
      };
    });
  }

  return convertedHotel;
};

/**
 * n gram을 만드는 함수
 * @param {string} text 변환할 글자
 * @returns {array} 변환된 n gram의 배열
 */
const generateNgrams = text => {
  if (!text) return [];
  const cleanText = text.replace(/\s+/g, '');
  const ngrams = new Set();

  for (let n = 1; n <= 3; n++) {
    for (let i = 0; i <= cleanText.length - n; i++) {
      ngrams.add(cleanText.substring(i, i + n));
    }
  }

  return [...ngrams];
};

// indexedDB 이용하여 호텔을 캐슁
const DB_NAME = 'HotelCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'hotels';
const CACHE_EXPIRATION = 5 * 60 * 1000; // ms

/**
 * 인덱스트 db 시작
 * @returns
 */
const initDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/**
 * indexedDB에서 호텔 찾아오기
 * @param {string} hotelId 호텔 id
 * @returns {object} 호텔 데이터
 */
const getFromCache = async hotelId => {
  const db = await initDB();
  return new Promise(resolve => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(hotelId);

    request.onsuccess = () => {
      const cache = request.result;
      if (cache && cache.expiry > Date.now()) {
        resolve(cache.data);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => resolve(null);
  });
};

/**
 * indexedDB에 호텔 데이터 저장
 * @param {object} hotelData
 * @returns
 */
const saveToCache = async hotelData => {
  const db = await initDB();
  return new Promise(resolve => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put({
      id: hotelData.id,
      data: hotelData,
      expiry: Date.now() + CACHE_EXPIRATION,
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
};

/**
 * id로 호텔 데이터를 받아오는 함수
 * @param {string} hotelId
 * @returns {object} 호텔 데이터
 */
const getHotelById = async hotelId => {
  try {
    // 호텔 id 검증
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    // indexedDB에 캐시되어 있는 데이터 확인 ? 바로 반환 : 패칭
    const cachedHotel = await getFromCache(hotelId);
    if (cachedHotel) {
      return cachedHotel;
    }

    // firestore에서 문서 찾아오기
    const hotelDocRef = doc(db, 'hotels', hotelId);
    const hotelDoc = await getDoc(hotelDocRef);

    // id를 가진 문서 확인 ? 데이터 : null
    if (hotelDoc.exists()) {
      const hotelData = {
        id: hotelDoc.id,
        ...hotelDoc.data(),
      };

      // 데이터를 변환
      const processedData = convertHotelPrices(hotelData);
      // 캐쉬에 저장
      await saveToCache(processedData);

      return processedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`호텔 ID ${hotelId} 조회 중 오류:`, error);
    throw error;
  }
};
/**
 * n gram 검색 결과에서 스코어가 같은 호텔들을  title로 정렬하는 함수
 * @param {Object[]} hotels
 * @returns
 */
const sortHotelsByTitleWithinSameScores = hotels => {
  // 스코어별로 그룹화
  const scoreGroups = hotels.reduce((groups, hotel) => {
    const score = hotel._debug.score;
    if (!groups[score]) groups[score] = [];
    groups[score].push(hotel);
    return groups;
  }, {});

  // 각 스코어 그룹 내에서 title로 정렬
  Object.values(scoreGroups).forEach(group => {
    group.sort((a, b) => {
      if (a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  });

  // 스코어 순서로 다시 하나의 배열로 합치기
  const isDes = true; // 내림차순
  return Object.keys(scoreGroups)
    .sort(
      isDes ? (a, b) => Number(b) - Number(a) : (a, b) => Number(a) - Number(b),
    )
    .flatMap(score => scoreGroups[score]);
};

/**
 * N-gram 기반 검색 함수
 * @param {[]} searchNgrams
 * @param {String} region
 * @param {Number} resultLimit
 * @param {Object} lastDoc
 * @returns
 */
const searchWithNgrams = async (searchNgrams, region, resultLimit, lastDoc) => {
  const searchResults = {};

  await Promise.all(
    searchNgrams.map(async ngram => {
      // n gram과 일치하는 문서 가져오기
      const searchIndexRef = collection(db, 'search_index');
      const ngramQuery = query(
        searchIndexRef,
        where(`combined_ngrams.${ngram}`, '==', true),
        ...(region ? [where('region', '==', region)] : []),
      );
      const ngramSnapshot = await getDocs(ngramQuery);

      // 각 문서에서 호텔 id와 스코어를 할당
      ngramSnapshot.forEach(doc => {
        const hotelId = doc.data().hotel_id;
        if (searchResults[hotelId]) {
          searchResults[hotelId].score += 1;
          searchResults[hotelId].matchedNgrams.push(ngram);
        } else {
          searchResults[hotelId] = {
            id: hotelId,
            score: 1,
            matchedNgrams: [ngram],
          };
        }
      });
    }),
  );

  // 스코어와 n gram 길이로 정렬
  const sortedResults = Object.values(searchResults).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    // 스코어가 같으면 n-gram 길이로 정렬
    const aMaxLength =
      a.matchedNgrams.length > 0
        ? Math.max(...a.matchedNgrams.map(ng => ng.length))
        : 0;
    const bMaxLength =
      b.matchedNgrams.length > 0
        ? Math.max(...b.matchedNgrams.map(ng => ng.length))
        : 0;

    return bMaxLength - aMaxLength;
  });

  // 호텔 id만 추출
  const sortedIds = sortedResults.map(item => item.id);

  // lastDoc이 있으면 시작 index 조정
  const startIndex = lastDoc ? sortedIds.indexOf(lastDoc.id) + 1 : 0;

  // 호텔 정보 받아오기
  const hotelPromises = sortedIds
    .slice(startIndex, startIndex + resultLimit)
    .map(async id => {
      const hotelData = await getHotelById(id);

      if (hotelData) {
        return {
          ...hotelData,
          // 디버그 추가
          _debug: {
            score: searchResults[id].score,
            matchedNgrams: searchResults[id].matchedNgrams,
          },
        };
      }
      return null;
    });

  // false 제거
  const hotelsWithData = (await Promise.all(hotelPromises)).filter(Boolean);

  // 정렬: 스코어 같으면 이름으로
  const sortedHotels = sortHotelsByTitleWithinSameScores(hotelsWithData);

  // 마지막 문서 참조
  const lastHotelDoc =
    sortedHotels.length > 0
      ? await getDoc(
          doc(db, 'hotels', sortedHotels[sortedHotels.length - 1].id),
        )
      : null;

  return { hotels: sortedHotels, lastDoc: lastHotelDoc };
};

/**
 * 일반 쿼리 검색
 * @param {String} region
 * @param {Number} resultLimit
 * @param {Object} lastDoc
 * @returns
 */
const searchWithBaseQuery = async (region, resultLimit, lastDoc) => {
  // 기본 쿼리
  const queryConditions = [
    orderBy('title'),
    firestoreLimit(resultLimit),
    region ? where('region', '==', region) : null,
    lastDoc ? startAfter(lastDoc) : null,
  ].filter(Boolean);

  // 쿼리 실행
  const baseQuery = query(collection(db, 'hotels'), ...queryConditions);
  const snapshot = await getDocs(baseQuery);

  // 호텔 데이터 가져오기
  const hotelPromises = snapshot.docs.map(async (document, index) => {
    const hotelId = document.id;
    const hotelData = await getHotelById(hotelId);

    if (hotelData) {
      return {
        ...hotelData,
        _debug: { index },
      };
    }
    return null;
  });

  // 결과 필터링
  const hotels = (await Promise.all(hotelPromises)).filter(Boolean);

  // 마지막 문서 참조
  const lastHotelDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { hotels, lastDoc: lastHotelDoc };
};

/**
 * 검색어를 n gram으로 처리하는 함수
 * @param {String} searchText
 * @param {String} region
 * @param {Number} limit
 * @param {Number} pageSize
 * @param {Object} lastDoc
 * @param {Boolean} pagination
 * @returns
 */
const searchHotelsAdvanced = async (
  searchText,
  region = null,
  limit = 20,
  pageSize = limit,
  lastDoc = null,
  pagination = false,
) => {
  try {
    // parameter 검증
    const resultLimit = pageSize || limit;

    if (searchText.length === 0 && !region) {
      return pagination ? { hotels: [], lastDoc: null } : [];
    }

    //  n gram 생성
    const searchNgrams = generateNgrams(searchText);

    let result;
    // n gram ? n gram 검색 : base query 검색
    if (searchNgrams.length > 0) {
      result = await searchWithNgrams(
        searchNgrams,
        region,
        resultLimit,
        lastDoc,
      );
    } else {
      result = await searchWithBaseQuery(region, resultLimit, lastDoc);
    }

    // pagination 안하면 호텔만 반환
    return pagination ? result : result.hotels;
  } catch (error) {
    console.error('호텔 검색 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 방 id로 검색
 * @param {String} roomId
 * @returns
 */
const getRoomById = async roomId => {
  try {
    if (!roomId) throw new Error('방 ID가 필요합니다');

    const roomDocRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomDocRef);
    if (roomDoc.exists()) {
      const roomData = {
        room_id: roomDoc.id,
        ...roomDoc.data(),
      };

      return roomData;
    } else null;
  } catch (error) {
    console.error('방 정보 가져오기 실패:', error);
    throw error;
  }
};

export {
  getHotelById,
  getRoomById,
  searchHotelsAdvanced,
  convertHotelPrices,
  convertPriceToNumber,
};
