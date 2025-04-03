import * as functions from 'firebase-functions/v1';

import { processPayment } from './process-payment.js';

/**
 * 결제 처리 함수 (Callable)
 * @param {Object} data - 요청 데이터
 * @param {Object} context - 인증 컨텍스트
 * @returns {Object} 결제 결과
 */
export const paymentHandler = async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '이 기능을 사용하려면 로그인이 필요합니다.',
    );
  }

  const { roomId, userInput } = data;

  if (!roomId || !userInput) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '필수 정보가 누락되었습니다.',
    );
  }

  return await processPayment(data);
};

/**
 * 결제 처리 함수 (HTTP)
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 */
export const paymentHttpHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { userId, amount, reservationData } = req.body;

  if (!userId || !amount || !reservationData) {
    res.status(400).json({
      success: false,
      message: '필수 정보가 누락되었습니다.',
    });
    return;
  }

  const result = await processPayment(userId, amount, reservationData);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};
