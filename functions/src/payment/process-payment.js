import * as functions from 'firebase-functions/v1';

import { processPayment } from './payment-service.js';

/**
 * 결제 처리 함수 (Callable)
 * @param {Object} data - 요청 데이터
 * @param {Object} context - 인증 컨텍스트
 * @returns {Object} 결제 결과
 */
export const paymentHandler = async (data, context) => {
  // 사용자 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      '이 기능을 사용하려면 로그인이 필요합니다.',
    );
  }

  const userId = context.auth.uid;
  const { amount, reservationData } = data;

  // 필수 파라미터 확인
  if (!amount || !reservationData) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '필수 정보가 누락되었습니다.',
    );
  }

  // 결제 처리
  return await processPayment(userId, amount, reservationData);
};

/**
 * 결제 처리 함수 (HTTP)
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 */
export const paymentHttpHandler = async (req, res) => {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { userId, amount, reservationData } = req.body;

  // 필수 파라미터 확인
  if (!userId || !amount || !reservationData) {
    res.status(400).json({
      success: false,
      message: '필수 정보가 누락되었습니다.',
    });
    return;
  }

  // 결제 처리
  const result = await processPayment(userId, amount, reservationData);

  // 결과 반환
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};
