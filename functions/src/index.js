import * as functions from 'firebase-functions/v1';

import { addPointsToUserHandler } from './admin/manage-points.js';
import { giveSignupPointsHandler } from './auth/user-points.js';
import app from './firebase-app.js';
import {
  paymentHandler,
  paymentHttpHandler,
} from './payment/payment-service.js';

console.log('index.js에서 Firebase 앱 참조:', app ? '성공' : '실패');

export const giveSignupPoints = functions
  .region('asia-northeast3')
  .auth.user()
  .onCreate(giveSignupPointsHandler);

export const addPointsToUser = functions
  .region('asia-northeast3')
  .https.onCall(addPointsToUserHandler);

export const payment = functions
  .region('asia-northeast3')
  .https.onCall(paymentHandler);

export const paymentHttp = functions
  .region('asia-northeast3')
  .https.onRequest(paymentHttpHandler);
