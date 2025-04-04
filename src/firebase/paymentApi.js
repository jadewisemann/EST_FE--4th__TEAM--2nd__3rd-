import { httpsCallable } from 'firebase/functions';

import { functions, auth } from './config';

export const callFunction = async (functionName, data = {}) => {
  try {
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
    throw {
      success: false,
      error,
    };
  }
};

export const processPayment = async paymentData =>
  await callFunction('payment', paymentData);

export const addPointsToUser = async (targetUserId, points, reason = '') =>
  await callFunction('addPointsToUser', {
    targetUserId,
    points: Number(points),
    reason,
  });
