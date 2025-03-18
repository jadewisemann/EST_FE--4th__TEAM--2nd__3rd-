import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';

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
const searchHotelsAdvanced = async (searchText, region = null) => {
  try {
    const searchNgrams = generateNgrams(searchText);

    if (searchNgrams.length === 0 && !region) return [];

    const searchIndexRef = collection(db, 'search_index');
    const queryPromises = [];

    if (searchNgrams.length > 0) {
      searchNgrams.forEach(ngram => {
        queryPromises.push(
          getDocs(
            query(
              searchIndexRef,
              where(`combined_ngrams.${ngram}`, '==', true),
              ...(region ? [where('region', '==', region)] : []),
            ),
          ),
        );
      });
    } else if (region) {
      queryPromises.push(
        getDocs(query(searchIndexRef, where('region', '==', region))),
      );
    }

    if (queryPromises.length === 0) return [];

    const queryResults = await Promise.all(queryPromises);
    const hotelMatches = {};

    queryResults.forEach((querySnapshot, index) => {
      querySnapshot.forEach(docSnapshot => {
        const hotelId = docSnapshot.data().hotel_id;

        if (hotelId in hotelMatches) {
          hotelMatches[hotelId].score += 1;
          if (searchNgrams.length > 0) {
            hotelMatches[hotelId].matchedNgrams.push(searchNgrams[index]);
          }
        } else {
          hotelMatches[hotelId] = {
            id: hotelId,
            score: 1,
            matchedNgrams: searchNgrams.length > 0 ? [searchNgrams[index]] : [],
          };
        }
      });
    });

    const sortedHotelIds = Object.values(hotelMatches)
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
      .map(match => match.id);

    const hotelDocs = await Promise.all(
      sortedHotelIds.map(id => getDoc(doc(db, 'hotels', id))),
    );

    return hotelDocs
      .filter(doc => doc.exists())
      .map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        _debug: {
          score: hotelMatches[doc.id].score,
          matchedNgrams: hotelMatches[doc.id].matchedNgrams,
          index: index,
        },
      }));
  } catch (error) {
    console.error('호텔 검색 중 오류 발생:', error);
    throw error;
  }
};

export default searchHotelsAdvanced;
