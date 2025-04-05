const validatePaymentData = data => {
  const { user, roomId, userInput } = data;

  // 사용자 정보 검증
  if (!user || !user.uid || typeof user.uid !== 'string') {
    return {
      success: false,
      message: '유효하지 않은 사용자 정보입니다.',
    };
  }

  if (!roomId || typeof roomId !== 'string') {
    return {
      success: false,
      message: '유효하지 않은 객실 ID입니다.',
    };
  }

  if (!userInput) {
    return {
      success: false,
      message: '예약 정보가 누락되었습니다.',
    };
  }

  // 필수 필드 검증
  const requiredFields = [
    'name',
    'phone',
    'email',
    'agreement',
    'paymentMethod',
    'paymentAmount',
    'guestCount',
    'checkIn',
    'checkOut',
  ];

  const missingFields = requiredFields.filter(
    field => userInput[field] === undefined || userInput[field] === null,
  );

  if (missingFields.length > 0) {
    return {
      success: false,
      message: `다음 필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
    };
  }

  // 결제 금액 검증
  if (
    !userInput.paymentAmount
    || typeof userInput.paymentAmount !== 'number'
    || userInput.paymentAmount <= 0
  ) {
    return {
      success: false,
      message: '유효하지 않은 결제 금액입니다.',
    };
  }

  // 포인트 검증
  if (
    userInput.point !== undefined
    && (typeof userInput.point !== 'number' || userInput.point < 0)
  ) {
    return {
      success: false,
      message: '유효하지 않은 포인트입니다.',
    };
  }

  // 날짜 형식 및 유효성 검증
  const yymmddRegex = /^\d{2}-\d{2}-\d{2}$/;
  const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;

  let checkIn = userInput.checkIn;
  let checkOut = userInput.checkOut;

  // 날짜 형식 정규화 (YY-MM-DD -> YYYY-MM-DD)
  if (yymmddRegex.test(checkIn)) {
    const parts = checkIn.split('-');
    checkIn = `20${parts[0]}-${parts[1]}-${parts[2]}`;
  } else if (!yyyymmddRegex.test(checkIn)) {
    return {
      success: false,
      message: '체크인 날짜는 YYYY-MM-DD 또는 YY-MM-DD 형식이어야 합니다.',
    };
  }

  if (yymmddRegex.test(checkOut)) {
    const parts = checkOut.split('-');
    checkOut = `20${parts[0]}-${parts[1]}-${parts[2]}`;
  } else if (!yyyymmddRegex.test(checkOut)) {
    return {
      success: false,
      message: '체크아웃 날짜는 YYYY-MM-DD 또는 YY-MM-DD 형식이어야 합니다.',
    };
  }

  // 날짜 유효성 검증
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return {
      success: false,
      message: '유효하지 않은 날짜입니다.',
    };
  }

  if (checkInDate >= checkOutDate) {
    return {
      success: false,
      message: '체크아웃 날짜는 체크인 날짜 이후여야 합니다.',
    };
  }

  // 게스트 수 검증
  if (typeof userInput.guestCount !== 'number' || userInput.guestCount <= 0) {
    return {
      success: false,
      message: '유효하지 않은 게스트 수입니다.',
    };
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInput.email)) {
    return {
      success: false,
      message: '유효하지 않은 이메일 형식입니다.',
    };
  }

  // 전화번호 형식 검증
  const phoneRegex = /^[\d\-]{10,13}$/;
  if (!phoneRegex.test(userInput.phone)) {
    return {
      success: false,
      message: '유효하지 않은 전화번호 형식입니다.',
    };
  }

  // 약관 동의 검증
  if (userInput.agreement !== true) {
    return {
      success: false,
      message: '이용 약관에 동의해야 합니다.',
    };
  }

  // 검증 통과 시 정규화된 데이터 반환
  return {
    success: true,
    data: {
      ...userInput,
      checkIn: checkIn,
      checkOut: checkOut,
    },
  };
};

export default validatePaymentData;
