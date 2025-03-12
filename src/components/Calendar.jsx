import { useState, useEffect, useRef } from 'react';

const Calendar = ({ startDate, endDate }) => {
  // 변수 선언
  const defaultDuration = 1;
  const initialMonthMount = 3;
  const addedMonthAmount = 3;
  const extraMonthLoadingInterval = 500; //ms

  // state 선언
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [months, setMonths] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // reference
  // memoized component
  const calendarRef = useRef(null);
  const headerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // prop 검증 => prop 기반으로 달 생성
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prop 비어 있으면 오늘 부터 {defaultDuration} 이후를 일정으로
    const start = startDate ? new Date(startDate) : today;
    const end = endDate
      ? new Date(endDate)
      : new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + defaultDuration,
        );

    // 시작일로 부터 {initialMonthMount} 만큼의 달을 만들기
    setMonths(
      Array.from(
        { length: initialMonthMount },
        (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1),
      ),
    );

    // 검증된 값을 상태에 할당
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setIsInitialized(true);
  }, [startDate, endDate]);

  // 초기 렌더링 시 첫 번째 월로 스크롤
  useEffect(() => {
    if (
      !isInitialized ||
      !calendarRef.current ||
      months.length === 0 ||
      isLoadingMore ||
      scrollPositionRef.current !== 0
    )
      return;

    calendarRef.current.querySelector('.month-container')?.scrollIntoView({
      behavior: 'auto',
    });
  }, [isInitialized, months.length, isLoadingMore]);

  // 스크롤 이벤트 감지 및 현재 보이는 월 업데이트
  useEffect(() => {
    // month가 생성 안되어 있으면 스크롤 방지
    const calendarElement = calendarRef.current;
    if (!calendarElement) return;

    // 이진 탐색
    const binarySearchVisibleArea = (elements, midpoint) => {
      let low = 0;
      let high = elements.length - 1;
      let visibleAreaIndex = 0;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const elementTop = elements[mid].getBoundingClientRect().top;

        if (elementTop < midpoint) {
          visibleAreaIndex = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return visibleAreaIndex;
    };

    // scroll handling
    const handleScroll = () => {
      const containerRect = calendarElement.getBoundingClientRect();
      const midpoint = containerRect.top + containerRect.height / 2;
      const monthElements = Array.from(
        calendarElement.querySelectorAll('.month-container'),
      );

      const visibleMonthIndex = binarySearchVisibleArea(
        monthElements,
        midpoint,
      );
      months[visibleMonthIndex];

      const { scrollTop, scrollHeight, clientHeight } = calendarElement;
      scrollPositionRef.current = scrollTop;

      if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoadingMore) {
        loadMoreMonths();
      }
    };

    calendarElement.addEventListener('scroll', handleScroll);
    return () => calendarElement.removeEventListener('scroll', handleScroll);
  }, [months, isLoadingMore]);

  // 스크롤 위치 복원
  useEffect(() => {
    if (
      calendarRef.current &&
      !isLoadingMore &&
      scrollPositionRef.current > 0
    ) {
      calendarRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [months, isLoadingMore]);

  // 더 많은 월 로드
  const loadMoreMonths = () => {
    // 현재 스크롤 위치 저장
    if (calendarRef.current) {
      scrollPositionRef.current = calendarRef.current.scrollTop;
    }

    setIsLoadingMore(true);

    // 새로운 달을 추가
    const addMonths = () => {
      const lastMonth = months[months.length - 1];
      const newMonths = Array.from(
        { length: addedMonthAmount },
        (_, i) =>
          new Date(lastMonth.getFullYear(), lastMonth.getMonth() + i + 1, 1),
      );

      // months 상태에 새로운 달 추가
      setMonths(prevMonths => [...prevMonths, ...newMonths]);

      // 로딩 상태 해제
      setIsLoadingMore(false);
    };

    // 지연 추가
    setTimeout(() => {
      addMonths();
    }, extraMonthLoadingInterval);
  };

  // date
  const getDaysInMonth = date =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = date =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDateForCompare = date => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isDateSelected = date => {
    if (!date || !selectedStartDate || !selectedEndDate) return false;

    const dateStr = formatDateForCompare(date);
    const startStr = formatDateForCompare(selectedStartDate);
    const endStr = formatDateForCompare(selectedEndDate);

    return dateStr === startStr || dateStr === endStr;
  };

  const isDateInRange = date => {
    if (!selectedStartDate || !selectedEndDate || !date) return false;

    const dateTime = date.getTime();
    return (
      dateTime > selectedStartDate.getTime() &&
      dateTime < selectedEndDate.getTime()
    );
  };

  const isDateInPast = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day, monthDate) => {
    const clickedDate = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      day,
    );

    if (isDateInPast(clickedDate)) {
      return;
    }

    if (!tempDate) {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setTempDate(clickedDate);
    } else {
      // Compare with temp date
      if (clickedDate.getTime() < tempDate.getTime()) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(tempDate);
      } else {
        setSelectedStartDate(tempDate);
        setSelectedEndDate(clickedDate);
      }
      setTempDate(null);
    }
  };

  const renderMonth = monthDate => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDayOfMonth = getFirstDayOfMonth(monthDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${monthDate.toISOString()}-${i}`}
          className='h-10'
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isPast = isDateInPast(date);

      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isTempSelected =
        tempDate &&
        formatDateForCompare(date) === formatDateForCompare(tempDate);

      const isStart =
        selectedStartDate &&
        formatDateForCompare(date) === formatDateForCompare(selectedStartDate);
      const isEnd =
        selectedEndDate &&
        formatDateForCompare(date) === formatDateForCompare(selectedEndDate);

      days.push(
        <div
          key={`day-${monthDate.toISOString()}-${day}`}
          onClick={() => !isPast && handleDateClick(day, monthDate)}
          className={`relative flex h-10 items-center justify-center gap-0 ${
            isPast ? 'cursor-not-allowed text-neutral-300' : 'cursor-pointer'
          } ${isTempSelected ? 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white' : isInRange ? 'bg-blue-100 text-black' : ''} `}
        >
          {isSelected && (
            <>
              <div
                className={`left absolute left-0 h-full w-1/2 ${isStart ? 'bg-transparent' : 'bg-blue-100'}`}
              ></div>
              <div
                className={`right absolute right-0 h-full w-1/2 ${isEnd ? 'bg-transparent' : 'bg-blue-100'}`}
              ></div>
            </>
          )}
          <div
            className={`relative z-10 ${isSelected && 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white'}`}
          >
            {day}
          </div>
        </div>,
      );
    }

    return (
      <div className='month-container mb-8'>
        <div className='mb-2 text-center text-sm font-medium'>
          {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
        </div>

        <div className='grid grid-cols-7 gap-x-0 gap-y-1'>{days}</div>
      </div>
    );
  };

  const renderSelectedRange = () => {
    const formatDate = date => {
      if (!date) return '선택되지 않음';
      // return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${
      return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
        ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
      })`;
    };

    return (
      <div className='mt-4 flex w-full justify-evenly'>
        <div className='flex flex-col items-center'>
          <div className='text-xs font-medium'>체크인</div>
          <div className='ml-2 text-lg font-bold'>
            {formatDate(selectedStartDate)}
          </div>
        </div>
        <div className='text-3xl font-bold'>{'->'}</div>
        <div className='flex flex-col items-center'>
          <div className='text-xs font-medium'>체크아웃</div>
          <div className='ml-2 text-lg font-bold'>
            {formatDate(selectedEndDate)}
          </div>
        </div>
      </div>
    );
  };

  const FixHeader = () => (
    <div ref={headerRef} className='shadow-bottom sticky top-0 z-10 mb-4 pb-2'>
      <div className='flex flex-col items-center justify-between'>
        <h2 className='flex w-full text-lg font-medium'>
          <button>X</button>
          <div>날짜 선택</div>
        </h2>
        {renderSelectedRange()}
      </div>

      {/* Weekday headers */}
      <div className='mt-4 mb-2 grid grid-cols-7 gap-1'>
        {['일', '월', '화', '수', '목', '금', '토'].map((weekday, index) => (
          <div key={index} className='text-center text-xs font-medium'>
            {weekday}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='mx-auto max-w-md rounded-lg bg-white py-4'>
      {/* 고정 해더 */}
      <FixHeader />

      {/* Calendar */}
      <div
        ref={calendarRef}
        className='max-h-96 overflow-y-auto'
        style={{ scrollbarWidth: 'none' }}
      >
        {months.map((month, index) => (
          <div key={`month-${index}`}>{renderMonth(month)}</div>
        ))}
        {isLoadingMore && (
          <div className='flex justify-center p-4'>
            <div className='text-purple-500'>로딩 중...</div>
          </div>
        )}
      </div>

      {/* bottom */}
      <div className='shadow-top absolute bottom-0 flex h-28 w-full items-center justify-center bg-white'>
        <button className='h-14 w-80 rounded-xl bg-purple-600 font-bold text-white'>
          확인({}박)
        </button>
      </div>
    </div>
  );
};

export default Calendar;
