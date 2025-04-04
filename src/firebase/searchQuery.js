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

const sortPrices = (price, priceFinal) => {
  const numericPrice = convertPriceToNumber(price);
  const numericPriceFinal = priceFinal ? convertPriceToNumber(priceFinal) : '';

  return numericPrice
    && numericPriceFinal !== ''
    && numericPriceFinal > numericPrice
    ? [numericPriceFinal, numericPrice]
    : [numericPrice, numericPriceFinal];
};

const convertPriceFields = item => {
  if (!item) return null;

  // 객체 깊은 복사
  const convertedItem = { ...item };

  // price와 price_final 필드가 있는지 확인
  if ('price' in convertedItem) {
    const [price, priceFinal] = sortPrices(
      convertedItem.price,
      convertedItem.price_final,
    );

    convertedItem.price = price;
    convertedItem.price_final = priceFinal;
  }

  return convertedItem;
};

const convertHotelPrices = hotel => {
  if (!hotel) return null;

  const convertedHotel = { ...hotel };

  // rooms가 있고, 배열인지 확인
  if (convertedHotel.rooms && Array.isArray(convertedHotel.rooms)) {
    // rooms를 순회하면서 각 room의 가격 필드 변환
    convertedHotel.rooms = convertedHotel.rooms.map(room =>
      convertPriceFields(room),
    );
  }

  return convertedHotel;
};

// 메모리 캐시
const memoryCache = new Map();

// indexedDB 이용하여 호텔을 캐슁
const DB_NAME = 'HotelCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'hotels';
const CACHE_EXPIRATION = 5 * 60 * 1000; // ms

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

const getHotelById = async hotelId => {
  try {
    // 호텔 id 검증
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    // 메모리 캐시 확인
    if (memoryCache.has(hotelId)) {
      return memoryCache.get(hotelId);
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
      // 인덱스드 db에 캐쉬에 저장
      await saveToCache(processedData);
      // 메모리 캐시
      memoryCache.set(hotelId, processedData);

      return processedData;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`호텔 ID ${hotelId} 조회 중 오류:`, error);
    throw error;
  }
};

const getRoomById = async roomId => {
  try {
    if (!roomId) throw new Error('방 ID가 필요합니다');

    const roomDocRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomDocRef);
    //
    if (roomDoc.exists()) {
      const roomData = {
        room_id: roomDoc.id,
        ...roomDoc.data(),
      };

      // 가격 필드 변환
      return convertPriceFields(roomData);
    } else {
      return null;
    }
  } catch (error) {
    console.error('방 정보 가져오기 실패:', error);
    throw error;
  }
};

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
  const isDes = true;
  return Object.keys(scoreGroups)
    .sort(
      isDes ? (a, b) => Number(b) - Number(a) : (a, b) => Number(a) - Number(b),
    )
    .flatMap(score => scoreGroups[score]);
};

const searchWithNgrams = async (
  searchNgrams,
  region,
  category,
  resultLimit,
  lastDoc,
  availableOnly = true,
) => {
  const searchResults = {};

  await Promise.all(
    searchNgrams.map(async ngram => {
      const searchIndexRef = collection(db, 'search_index');

      const conditions = [where(`combined_ngrams.${ngram}`, '==', true)];

      if (region) {
        conditions.push(where('region', '==', region));
      }

      if (category) {
        conditions.push(where('category', '==', category));
      }

      const ngramQuery = query(searchIndexRef, ...conditions);
      const ngramSnapshot = await getDocs(ngramQuery);

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

  const sortedResults = Object.values(searchResults).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

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

  const sortedIds = sortedResults.map(item => item.id);

  const startIndex = lastDoc ? sortedIds.indexOf(lastDoc.id) + 1 : 0;

  const hotelPromises = sortedIds
    .slice(startIndex, startIndex + resultLimit)
    .map(async id => {
      const hotelData = await getHotelById(id);

      return !hotelData
        ? null
        : availableOnly && (!hotelData.rooms || hotelData.rooms.length === 0)
          ? null
          : {
              ...hotelData,
              _debug: {
                score: searchResults[id].score,
                matchedNgrams: searchResults[id].matchedNgrams,
              },
            };
    });

  const hotelsWithData = (await Promise.all(hotelPromises)).filter(Boolean);

  const sortedHotels = sortHotelsByTitleWithinSameScores(hotelsWithData);

  const lastHotelDoc =
    sortedHotels.length > 0
      ? await getDoc(
          doc(db, 'hotels', sortedHotels[sortedHotels.length - 1].id),
        )
      : null;

  return { hotels: sortedHotels, lastDoc: lastHotelDoc };
};

const searchWithBaseQuery = async (
  region,
  category,
  resultLimit,
  lastDoc,
  availableOnly = true,
) => {
  const queryConditions = [orderBy('title'), firestoreLimit(resultLimit)];

  if (region) {
    queryConditions.push(where('region', '==', region));
  }

  if (lastDoc) {
    queryConditions.push(startAfter(lastDoc));
  }

  const baseQuery = query(collection(db, 'hotels'), ...queryConditions);
  const snapshot = await getDocs(baseQuery);

  let categoryHotelIds = null;
  if (category) {
    const categoryQuery = query(
      collection(db, 'search_index'),
      where('category', '==', category),
    );
    const categorySnapshot = await getDocs(categoryQuery);
    categoryHotelIds = new Set(
      categorySnapshot.docs.map(doc => doc.data().hotel_id),
    );
  }

  const hotelPromises = snapshot.docs.map(async (document, index) => {
    const hotelId = document.id;

    if (categoryHotelIds !== null && !categoryHotelIds.has(hotelId)) {
      return null;
    }

    const hotelData = await getHotelById(hotelId);

    return !hotelData
      ? null
      : availableOnly && (!hotelData.rooms || hotelData.rooms.length === 0)
        ? null
        : {
            ...hotelData,
            _debug: { index },
          };
  });

  const hotels = (await Promise.all(hotelPromises)).filter(Boolean);

  const lastHotelDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { hotels, lastDoc: lastHotelDoc };
};

const searchHotelsAdvanced = async (
  searchText,
  region = null,
  category = null,
  limit = 20,
  pageSize = limit,
  lastDoc = null,
  pagination = false,
  availableOnly = true,
) => {
  try {
    const resultLimit = pageSize || limit;

    if (searchText.length === 0 && !region && !category) {
      return pagination ? { hotels: [], lastDoc: null } : [];
    }

    const searchNgrams = generateNgrams(searchText);

    let result;
    if (searchNgrams.length > 0) {
      result = await searchWithNgrams(
        searchNgrams,
        region,
        category,
        resultLimit,
        lastDoc,
        availableOnly,
      );
    } else {
      result = await searchWithBaseQuery(
        region,
        category,
        resultLimit,
        lastDoc,
        availableOnly,
      );
    }

    return pagination ? result : result.hotels;
  } catch (error) {
    console.error('호텔 검색 중 오류 발생:', error);
    throw error;
  }
};

export {
  getHotelById,
  getRoomById,
  searchHotelsAdvanced,
  convertHotelPrices,
  convertPriceToNumber,
  convertPriceFields,
  sortPrices,
};
