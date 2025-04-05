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

  const convertedItem = { ...item };

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

  if (convertedHotel.rooms && Array.isArray(convertedHotel.rooms)) {
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

const getHotelById = async (hotelId, checkIn = null, checkOut = null) => {
  try {
    // 호텔 id 검증
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    if (!checkIn && !checkOut && memoryCache.has(hotelId)) {
      return memoryCache.get(hotelId);
    }

    if (!checkIn && !checkOut) {
      const cachedHotel = await getFromCache(hotelId);
      if (cachedHotel) {
        return cachedHotel;
      }
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

      // 객실 필터링 수행
      if (checkIn && checkOut) {
        // 날짜 범위 생성
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
          throw new Error('유효하지 않은 날짜입니다');
        }

        const dateRange = [];
        const tempDate = new Date(checkInDate);
        while (tempDate < checkOutDate) {
          dateRange.push(tempDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식
          tempDate.setDate(tempDate.getDate() + 1);
        }

        // 호텔의 모든 객실 정보 가져오기
        const roomsQuery = query(
          collection(db, 'rooms'),
          where('hotel_uid', '==', hotelId),
        );
        const roomsSnapshot = await getDocs(roomsQuery);

        const availableRooms = [];

        for (const roomDoc of roomsSnapshot.docs) {
          const roomData = {
            room_id: roomDoc.id,
            ...roomDoc.data(),
          };

          const reservedDates = roomData.reservedDates || {};

          const isAvailable = !dateRange.some(date => reservedDates[date]);

          if (isAvailable) {
            availableRooms.push(convertPriceFields(roomData));
          }
        }

        hotelData.rooms = availableRooms;

        return convertHotelPrices(hotelData);
      }

      const processedData = convertHotelPrices(hotelData);
      await saveToCache(processedData);
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

const getAvailableRooms = async (hotelId, checkIn, checkOut) => {
  try {
    if (!hotelId) throw new Error('호텔 ID가 필요합니다');

    if (!checkIn || !checkOut) {
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('hotelId', '==', hotelId),
      );
      const roomSnapshot = await getDocs(roomsQuery);
      return roomSnapshot.docs.map(doc => ({
        room_id: doc.id,
        ...doc.data(),
      }));
    }

    // 날짜 처리
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('유효하지 않은, 날짜입니다');
    }

    if (checkInDate >= checkOutDate) {
      throw new Error('체크아웃 날짜는 체크인 날짜 이후여야 합니다');
    }

    // 날짜 범위 생성
    const dateRange = [];
    const tempDate = new Date(checkInDate);
    while (tempDate < checkOutDate) {
      dateRange.push(tempDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식
      tempDate.setDate(tempDate.getDate() + 1);
    }

    // 호텔의 모든 객실 가져오기
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('hotelId', '==', hotelId),
    );
    const roomSnapshot = await getDocs(roomsQuery);

    const availableRooms = [];

    for (const roomDoc of roomSnapshot.docs) {
      const roomData = {
        room_id: roomDoc.id,
        ...roomDoc.data(),
      };

      const reservatedDates = roomData.reservatedDates || {};

      const isAvailable = !dateRange.some(date => reservatedDates[date]);

      if (isAvailable) {
        availableRooms.push(convertPriceFields(roomData));
      }
    }

    return availableRooms;
  } catch (error) {
    console.error('가용 객실 정보 가져오기 실패:', error);
    throw error;
  }
};

const isHotelAvailable = async (hotelId, checkIn, checkOut) => {
  try {
    if (!checkIn || !checkOut) return true;

    const availabilityRef = doc(db, 'availability', hotelId);
    const availabilityDoc = await getDoc(availabilityRef);

    if (!availabilityDoc.exists()) {
      const searchIndexRef = doc(db, 'search_index', hotelId);
      const searchIndexDoc = await getDoc(searchIndexRef);

      if (searchIndexDoc.exists()) {
        const reservatedDates = searchIndexDoc.data().reservatedDates || [];

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const dateRange = [];

        const tempDate = new Date(checkInDate);
        while (tempDate < checkOutDate) {
          dateRange.push(tempDate.toISOString().split('T')[0]);
          tempDate.setDate(tempDate.getDate() + 1);
        }

        return !dateRange.some(date => reservatedDates.includes(date));
      }

      const availableRooms = await getAvailableRooms(
        hotelId,
        checkIn,
        checkOut,
      );
      return availableRooms.length > 0;
    }

    const availabilityData = availabilityDoc.data();
    const dates = availabilityData.dates || {};

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const dateRange = [];

    const tempDate = new Date(checkInDate);
    while (tempDate < checkOutDate) {
      dateRange.push(tempDate.toISOString().split('T')[0]);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return !dateRange.some(date => {
      const availableCount = dates[date] || 0;
      return availableCount === 0;
    });
  } catch (error) {
    console.error(`호텔 ID ${hotelId} 가용성 확인 중 오류:`, error);
    return true;
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
  checkIn = null,
  checkOut = null,
) => {
  const searchResults = {};

  let availabilityFilter = [];
  if (checkIn && checkOut) {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const dateRange = [];
        const tempDate = new Date(checkInDate);

        while (tempDate < checkOutDate) {
          dateRange.push(tempDate.toISOString().split('T')[0]);
          tempDate.setDate(tempDate.getDate() + 1);
        }

        const unavailableHotelsSet = new Set();

        for (const date of dateRange) {
          const searchIndexQuery = query(
            collection(db, 'search_index'),
            where('reservatedDates', 'array-contains', date),
          );

          const snapshot = await getDocs(searchIndexQuery);
          snapshot.forEach(doc => {
            unavailableHotelsSet.add(doc.data().hotel_id);
          });
        }

        availabilityFilter = Array.from(unavailableHotelsSet);
      }
    } catch (error) {
      console.error('가용성 필터 생성 중 오류:', error);
    }
  }

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

        if (availabilityFilter.includes(hotelId)) {
          return;
        }

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

      if (!hotelData) return null;

      if (availableOnly && checkIn && checkOut) {
        const isAvailable = await isHotelAvailable(id, checkIn, checkOut);
        if (!isAvailable) return null;

        const availableRooms = await getAvailableRooms(id, checkIn, checkOut);
        if (!availableRooms || availableRooms.length === 0) return null;

        const hotelWithAvailableRooms = {
          ...hotelData,
          rooms: availableRooms,
          _debug: {
            score: searchResults[id].score,
            matchedNgrams: searchResults[id].matchedNgrams,
          },
        };

        return hotelWithAvailableRooms;
      }

      return availableOnly && (!hotelData.rooms || hotelData.rooms.length === 0)
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
  checkIn = null,
  checkOut = null,
) => {
  let unavailableHotelIds = new Set();
  if (checkIn && checkOut) {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const dateRange = [];
        const tempDate = new Date(checkInDate);

        while (tempDate < checkOutDate) {
          dateRange.push(tempDate.toISOString().split('T')[0]);
          tempDate.setDate(tempDate.getDate() + 1);
        }

        for (const date of dateRange) {
          const searchIndexQuery = query(
            collection(db, 'search_index'),
            where('reservatedDates', 'array-contains', date),
          );

          const snapshot = await getDocs(searchIndexQuery);
          snapshot.forEach(doc => {
            unavailableHotelIds.add(doc.data().hotel_id);
          });
        }
      }
    } catch (error) {
      console.error('가용성 필터 생성 중 오류:', error);
    }
  }

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

    if (checkIn && checkOut && unavailableHotelIds.has(hotelId)) {
      return null;
    }

    const hotelData = await getHotelById(hotelId);

    if (!hotelData) return null;

    if (availableOnly && checkIn && checkOut) {
      const isAvailable = await isHotelAvailable(hotelId, checkIn, checkOut);
      if (!isAvailable) return null;

      const availableRooms = await getAvailableRooms(
        hotelId,
        checkIn,
        checkOut,
      );
      if (!availableRooms || availableRooms.length === 0) return null;

      const hotelWithAvailableRooms = {
        ...hotelData,
        rooms: availableRooms,
        _debug: { index },
      };

      return hotelWithAvailableRooms;
    }

    return availableOnly && (!hotelData.rooms || hotelData.rooms.length === 0)
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
  checkIn = null,
  checkOut = null,
) => {
  try {
    const resultLimit = pageSize || limit;

    if (
      searchText.length === 0
      && !region
      && !category
      && !checkIn
      && !checkOut
    ) {
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
        checkIn,
        checkOut,
      );
    } else {
      result = await searchWithBaseQuery(
        region,
        category,
        resultLimit,
        lastDoc,
        availableOnly,
        checkIn,
        checkOut,
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
  getAvailableRooms,
  isHotelAvailable,
  searchHotelsAdvanced,
  convertHotelPrices,
  convertPriceToNumber,
  convertPriceFields,
  sortPrices,
};
