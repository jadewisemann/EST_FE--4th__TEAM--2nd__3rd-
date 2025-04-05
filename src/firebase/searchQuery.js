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

import { createCacheUtil } from '../utils/cache';
import { convertPriceFields } from '../utils/prices';

import { db } from './config';

const hotelCache = createCacheUtil('hotels', {
  cacheExpiration: 5 * 60 * 1000,
});

const convertHotelPrices = hotel => {
  if (!hotel) return null;

  const convertedHotel = { ...hotel };

  if (convertedHotel.rooms && Array.isArray(convertedHotel.rooms)) {
    convertedHotel.rooms = convertedHotel.rooms.map(convertPriceFields);
  }

  return convertedHotel;
};

const generateDateRange = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error('유효하지 않은 날짜입니다');
  }

  if (checkInDate >= checkOutDate) {
    throw new Error('체크아웃 날짜는 체크인 날짜 이후여야 합니다');
  }

  const dateRange = [];
  const tempDate = new Date(checkInDate);

  while (tempDate < checkOutDate) {
    dateRange.push(tempDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return dateRange;
};

const validateDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return null;
  return generateDateRange(checkIn, checkOut);
};

const isRoomAvailable = (roomData, dateRange) => {
  const reservedDates = roomData.reservedDates || {};
  return !dateRange.some(date => reservedDates[date]);
};

const getAvailableRooms = async (hotelId, checkIn, checkOut) => {
  try {
    if (!hotelId) throw new Error('호텔 ID가 필요합니다');

    if (!checkIn || !checkOut) {
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('hotel_uid', '==', hotelId),
      );
      const roomSnapshot = await getDocs(roomsQuery);

      return roomSnapshot.docs.map(doc => ({
        room_id: doc.id,
        ...doc.data(),
      }));
    }

    // 날짜 처리
    const dateRange = validateDates(checkIn, checkOut);

    // 호텔의 모든 객실 가져오기
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('hotel_uid', '==', hotelId),
    );
    const roomSnapshot = await getDocs(roomsQuery);

    const availableRooms = roomSnapshot.docs
      .map(doc => ({
        room_id: doc.id,
        ...doc.data(),
      }))
      .filter(roomData => isRoomAvailable(roomData, dateRange))
      .map(convertPriceFields);

    return availableRooms;
  } catch (error) {
    console.error(error);
  }
};

const isHotelAvailable = async (hotelId, checkIn, checkOut) => {
  try {
    if (!checkIn || !checkOut) return true;

    const dateRange = validateDates(checkIn, checkOut);

    const availabilityRef = doc(db, 'availability', hotelId);
    const availabilityDoc = await getDoc(availabilityRef);

    if (!availabilityDoc.exists()) {
      const searchIndexRef = doc(db, 'search_index', hotelId);
      const searchIndexDoc = await getDoc(searchIndexRef);

      if (searchIndexDoc.exists()) {
        const reservedDates = searchIndexDoc.data().reservedDates || [];
        return !dateRange.some(date => reservedDates.includes(date));
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

    return !dateRange.some(date => dates[date] === 0);
  } catch (error) {
    console.error(error);
    return true;
  }
};

const getHotelById = async (hotelId, checkIn = null, checkOut = null) => {
  try {
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    if (!checkIn && !checkOut) {
      const cachedHotel = await hotelCache.get(hotelId);
      if (cachedHotel) {
        return cachedHotel;
      }
    }

    const hotelDocRef = doc(db, 'hotels', hotelId);
    const hotelDoc = await getDoc(hotelDocRef);

    if (!hotelDoc.exists()) {
      return null;
    }

    const hotelData = {
      id: hotelDoc.id,
      ...hotelDoc.data(),
    };

    if (checkIn && checkOut) {
      const dateRange = validateDates(checkIn, checkOut);

      const roomsQuery = query(
        collection(db, 'rooms'),
        where('hotel_uid', '==', hotelId),
      );
      const roomsSnapshot = await getDocs(roomsQuery);

      const availableRooms = roomsSnapshot.docs
        .map(roomDoc => ({
          room_id: roomDoc.id,
          ...roomDoc.data(),
        }))
        .filter(roomData => isRoomAvailable(roomData, dateRange))
        .map(convertPriceFields);

      hotelData.rooms = availableRooms;
      return convertHotelPrices(hotelData);
    }

    const processedData = convertHotelPrices(hotelData);

    if (!checkIn && !checkOut) {
      await hotelCache.set(hotelId, processedData);
    }

    return processedData;
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

    if (!roomDoc.exists()) {
      return null;
    }

    const roomData = {
      room_id: roomDoc.id,
      ...roomDoc.data(),
    };

    return convertPriceFields(roomData);
  } catch (error) {
    console.error('방 정보 가져오기 실패:', error);
    throw error;
  }
};

// ======= 검색 관련 유틸리티 =======
const generateNgrams = props => {
  const text = typeof props === 'object' ? props.searchText : props;

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
  const scoreGroups = hotels.reduce((groups, hotel) => {
    const score = hotel._debug.score;
    if (!groups[score]) groups[score] = [];
    groups[score].push(hotel);
    return groups;
  }, {});

  Object.values(scoreGroups).forEach(group => {
    group.sort((a, b) => {
      if (a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  });

  const isDes = true;
  return Object.keys(scoreGroups)
    .sort(
      isDes ? (a, b) => Number(b) - Number(a) : (a, b) => Number(a) - Number(b),
    )
    .flatMap(score => scoreGroups[score]);
};

const getUnavailableHotelIds = async (checkIn, checkOut) => {
  const unavailableHotelIds = new Set();

  if (!checkIn || !checkOut) {
    return unavailableHotelIds;
  }

  try {
    const dateRange = validateDates(checkIn, checkOut);

    for (const date of dateRange) {
      const searchIndexQuery = query(
        collection(db, 'search_index'),
        where('reservedDates', 'array-contains', date),
      );

      const snapshot = await getDocs(searchIndexQuery);
      snapshot.forEach(doc => {
        unavailableHotelIds.add(doc.data().hotel_id);
      });
    }

    const availabilityQuery = query(collection(db, 'availability'));
    const availabilitySnapshot = await getDocs(availabilityQuery);

    availabilitySnapshot.forEach(availabilityDoc => {
      const hotelId = availabilityDoc.id;
      const dates = availabilityDoc.data().dates || {};

      const isUnavailable = dateRange.some(date => dates[date] === 0);

      if (isUnavailable) {
        unavailableHotelIds.add(hotelId);
      }
    });
  } catch (error) {
    console.error('가용성 필터 생성 중 오류:', error);
  }

  return unavailableHotelIds;
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
  const unavailableHotelIds = await getUnavailableHotelIds(checkIn, checkOut);

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
        if (unavailableHotelIds.has(hotelId)) {
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

        return {
          ...hotelData,
          rooms: availableRooms,
          _debug: {
            score: searchResults[id].score,
            matchedNgrams: searchResults[id].matchedNgrams,
          },
        };
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
  const unavailableHotelIds = await getUnavailableHotelIds(checkIn, checkOut);

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

    if (unavailableHotelIds.has(hotelId)) {
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

      return {
        ...hotelData,
        rooms: availableRooms,
        _debug: { index },
      };
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

const searchHotelsAdvanced = async ({
  searchText = '',
  region = null,
  category = null,
  limit = 20,
  pageSize = limit,
  lastDoc = null,
  pagination = false,
  availableOnly = true,
  checkIn = null,
  checkOut = null,
}) => {
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
  convertPriceFields,
  sortHotelsByTitleWithinSameScores,
};
