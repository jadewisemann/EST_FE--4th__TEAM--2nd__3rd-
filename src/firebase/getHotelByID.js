import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * 호텔 ID로 단일 호텔 정보를 가져오는 함수
 * @param {string} hotelId - 가져올 호텔의 ID
 * @returns {Promise<object|null>} - 호텔 데이터 객체 또는 존재하지 않을 경우 null
 */

const getHotelById = async hotelId => {
  try {
    if (!hotelId) {
      throw new Error('호텔 ID가 필요합니다');
    }

    const hotelDocRef = doc(db, 'hotels', hotelId);
    const hotelDoc = await getDoc(hotelDocRef);

    if (hotelDoc.exists()) {
      return {
        id: hotelDoc.id,
        ...hotelDoc.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('호텔 정보 가져오기 실패:', error);
    throw error;
  }
};

export default getHotelById;
