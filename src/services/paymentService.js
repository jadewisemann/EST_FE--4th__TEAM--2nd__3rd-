import { processPayment } from '../firebase/paymentApi';

export const requestPayment = async paymentData =>
  await processPayment(paymentData);

export const validatePaymentData = (userId, amount, reservationData) => {
  const errors = {};

  if (!userId || typeof userId !== 'string') {
    errors.userId = '유효하지 않은 사용자 ID입니다.';
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.amount = '유효하지 않은 결제 금액입니다.';
  }

  if (!reservationData || typeof reservationData !== 'object') {
    errors.reservationData = '예약 정보가 유효하지 않습니다.';
    return { isValid: false, errors };
  }

  const missingFields = [
    'hotelId',
    'hotelName',
    'checkIn',
    'checkOut',
    'room',
    'roomId',
    'roomImg',
    'guestCount',
    'reservation_name',
    'reservation_phone',
    'reservation_email',
    'reservation_request',
    'agreement',
    'paymentMethod',
  ].filter(field => !reservationData[field]);

  if (missingFields.length > 0) {
    errors.missingFields = {
      message: `다음 필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
      fields: missingFields,
    };
  }

  // reservationData/날짜 검증
  // reservationData/날짜/형식 검증
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (reservationData.checkIn && !dateRegex.test(reservationData.checkIn)) {
    errors.checkIn = '체크인 날짜는 YYYY-MM-DD 형식이어야 합니다.';
  }

  if (reservationData.checkOut && !dateRegex.test(reservationData.checkOut)) {
    errors.checkOut = '체크아웃 날짜는 YYYY-MM-DD 형식이어야 합니다.';
  }

  // reservationData/날짜/유효성 검증
  if (reservationData.checkIn && reservationData.checkOut) {
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);

    if (isNaN(checkInDate.getTime())) {
      errors.checkIn = '유효하지 않은 체크인 날짜입니다.';
    }

    if (isNaN(checkOutDate.getTime())) {
      errors.checkOut = '유효하지 않은 체크아웃 날짜입니다.';
    }

    // reservationData/날짜/논리 검증
    if (
      !isNaN(checkInDate.getTime())
      && !isNaN(checkOutDate.getTime())
      && checkInDate >= checkOutDate
    ) {
      errors.checkOut = '체크아웃 날짜는 체크인 날짜 이후여야 합니다.';
    }
  }

  // reservationData/게스트 검증
  if (
    reservationData.guestCount !== undefined
    && (typeof reservationData.guestCount !== 'number'
      || reservationData.guestCount <= 0)
  ) {
    errors.guestCount = '유효하지 않은 게스트 수입니다.';
  }

  // reservationData/이메일 검증
  if (reservationData.reservation_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reservationData.reservation_email)) {
      errors.reservation_email = '유효한 이메일 주소를 입력해주세요.';
    }
  }

  // reservationData/전화번호 검증
  if (reservationData.reservation_phone) {
    const phoneRegex = /^\d{2,3}-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(reservationData.reservation_phone)) {
      errors.reservation_phone = '유효한 전화번호 형식이 아닙니다.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
