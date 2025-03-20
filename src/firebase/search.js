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

const convertHotelPrices = hotel => {
  if (!hotel) return null;

  const convertedHotel = { ...hotel };

  if (convertedHotel.rooms && Array.isArray(convertedHotel.rooms)) {
    convertedHotel.rooms = convertedHotel.rooms.map(room => ({
      ...room,
      price: convertPriceToNumber(room.price),
      price_final: room.price_final
        ? convertPriceToNumber(room.price_final)
        : '',
    }));
  }

  return convertedHotel;
};

/**
 * 검색어로부터 n-gram을 생성하는 함수
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

/**
 * n-gram 기반 호텔 검색 함수
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
    const resultLimit = pageSize || limit;

    if (searchText.length === 0 && !region) {
      return pagination ? { hotels: [], lastDoc: null } : [];
    }
    const searchNgrams = generateNgrams(searchText);

    let baseQuery = query(
      collection(db, 'hotels'),
      orderBy('name'),
      firestoreLimit(resultLimit),
    );

    if (region) {
      baseQuery = query(baseQuery, where('region', '==', region));
    }

    if (lastDoc) {
      baseQuery = query(baseQuery, startAfter(lastDoc));
    }

    if (searchNgrams.length > 0) {
      const searchResults = {};

      for (const ngram of searchNgrams) {
        const searchIndexRef = collection(db, 'search_index');
        const ngramQuery = query(
          searchIndexRef,
          where(`combined_ngrams.${ngram}`, '==', true),
          ...(region ? [where('region', '==', region)] : []),
        );

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
      }

      const sortedIds = Object.values(searchResults)
        .sort((a, b) => {
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
        })
        .map(item => item.id);

      let startIndex = 0;
      if (lastDoc) {
        const lastId = lastDoc.id;
        startIndex = sortedIds.indexOf(lastId) + 1;
      }

      const paginatedIds = sortedIds.slice(
        startIndex,
        startIndex + resultLimit,
      );

      const hotelDocs = await Promise.all(
        paginatedIds.map(id => getDoc(doc(db, 'hotels', id))),
      );

      const hotels = hotelDocs
        .filter(doc => doc.exists())
        .map((doc, index) => {
          const hotelData = {
            id: doc.id,
            ...doc.data(),
            _debug: {
              score: searchResults[doc.id].score,
              matchedNgrams: searchResults[doc.id].matchedNgrams,
              index: index + startIndex,
            },
          };
          return convertHotelPrices(hotelData);
        });

      const lastHotelDoc =
        hotels.length > 0
          ? await getDoc(doc(db, 'hotels', hotels[hotels.length - 1].id))
          : null;

      return pagination
        ? {
            hotels,
            lastDoc: lastHotelDoc,
          }
        : hotels;
    } else {
      const snapshot = await getDocs(baseQuery);

      const hotels = snapshot.docs.map((doc, index) => {
        const hotelData = {
          id: doc.id,
          ...doc.data(),
          _debug: {
            index,
          },
        };
        return convertHotelPrices(hotelData);
      });

      return pagination
        ? {
            hotels,
            lastDoc:
              snapshot.docs.length > 0
                ? snapshot.docs[snapshot.docs.length - 1]
                : null,
          }
        : hotels;
    }
  } catch (error) {
    console.error('호텔 검색 중 오류 발생:', error);
    throw error;
  }
};

const getHotelById = async hotelId => {
  try {
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    const hotelDocRef = doc(db, 'hotels', hotelId);
    const hotelDoc = await getDoc(hotelDocRef);

    if (hotelDoc.exists()) {
      const hotelData = {
        id: hotelDoc.id,
        ...hotelDoc.data(),
      };
      return convertHotelPrices(hotelData);
    } else {
      return null;
    }
  } catch (error) {
    console.error('호텔 정보 가져오기 실패:', error);
    throw error;
  }
};

export {
  getHotelById,
  searchHotelsAdvanced,
  convertHotelPrices,
  convertPriceToNumber,
};
