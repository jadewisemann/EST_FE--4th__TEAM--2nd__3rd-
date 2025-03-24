import { httpsCallable } from 'firebase/functions';

import { functions, auth } from './config';

/**
 * Firebase Functions를 호출하는 유틸리티 함수
 * @param {string} functionName - 호출할 함수 이름
 * @param {object} data - 함수에 전달할 데이터
 * @returns {Promise<any>} - 함수 호출 결과
 */
export const callFunction = async (functionName, data = {}) => {
  try {
    // 로그인 검증
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw {
        success: false,
        message: '먼저 로그인 해야 합니다.',
      };
    }

    const functionRef = httpsCallable(functions, functionName);
    const result = await functionRef(data);
    return result.data;
  } catch (error) {
    console.error(`Firebase 함수 '${functionName}' 호출 중 오류 발생:`, error);
    throw {
      success: false,
      error,
    };
  }
};

/**
 * 결제 처리 함수 호출
 * @param {number} amount - 결제 금액
 * @param {object} reservationData - 예약 정보
 * @param {string} userId - 사용자 ID (선택 사항)
 * @returns {Promise<any>} - 결제 처리 결과
 */
export const processPayment = async (userId, amount, reservationData) =>
  await callFunction('payment', {
    userId,
    amount: Number(amount),
    reservationData,
  });

/**
 * 포인트 추가 함수 호출
 * @param {string} targetUserId - 포인트를 추가할 대상 사용자 ID
 * @param {number} points - 추가할 포인트 수
 * @param {string} reason - 포인트 추가 이유
 * @returns {Promise<any>} - 포인트 추가 결과
 */
export const addPointsToUser = async (targetUserId, points, reason = '') =>
  await callFunction('addPointsToUser', {
    targetUserId,
    points: Number(points),
    reason,
  });
