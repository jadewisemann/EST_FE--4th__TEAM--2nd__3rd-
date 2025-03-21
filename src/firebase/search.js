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
    convertedHotel.rooms = convertedHotel.rooms.map(room => {
      const numericPrice = convertPriceToNumber(room.price);
      const numericPriceFinal = room.price_final
        ? convertPriceToNumber(room.price_final)
        : '';

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

const searchHotelsAdvanced = async (
  searchText,
  region = null,
  limit = 20,
  pageSize = limit,
  lastDoc = null,
  pagination = false,
) => {
  try {
    // prop 검증
    const resultLimit = pageSize || limit;

    // 검색어 ? n gram 생성 : []
    if (searchText.length === 0 && !region) {
      return pagination ? { hotels: [], lastDoc: null } : [];
    }

    const searchNgrams = generateNgrams(searchText);

    // 호텔 검색 쿼리 설정
    const queryConditions = [
      orderBy('name'),
      firestoreLimit(resultLimit),
      region ? where('region', '==', region) : null,
      lastDoc ? startAfter(lastDoc) : null,
    ].filter(Boolean);

    const baseQuery = query(collection(db, 'hotels'), ...queryConditions);

    // n gram 인덱스 검색
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

      const hotelPromises = paginatedIds.map(async id => {
        const hotelData = await getHotelById(id);

        if (hotelData) {
          return {
            ...hotelData,
            _debug: {
              score: searchResults[id].score,
              matchedNgrams: searchResults[id].matchedNgrams,
            },
          };
        }
        return null;
      });

      const hotelsWithData = await Promise.all(hotelPromises);
      const hotels = hotelsWithData.filter(hotel => hotel !== null);

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

      const hotelPromises = snapshot.docs.map(async (document, index) => {
        const hotelId = document.id;
        const hotelData = await getHotelById(hotelId);

        if (hotelData) {
          return {
            ...hotelData,
            _debug: {
              index,
            },
          };
        }
        return null;
      });

      const hotelsWithData = await Promise.all(hotelPromises);
      const hotels = hotelsWithData.filter(hotel => hotel !== null);

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
