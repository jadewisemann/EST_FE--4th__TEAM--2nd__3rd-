import { useState, useEffect, useRef } from 'react';

const Calendar = ({ startDate, endDate, onChange }) => {
  const handleDateChange = onChange;
  // 기본 변수
  const DEFAULT_DURATION = 1;
  const DEFAULT_MONTH_LENGTH = 12;

  // state 선언
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [months, setMonths] = useState([]);

  // ref
  const prevStartRef = useRef();
  const prevEndRef = useRef();

  // prop 검증 및 달력 초기
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prop 비었을 경우
    const start = startDate ? new Date(startDate) : today;
    const end = endDate
      ? new Date(endDate)
      : new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + DEFAULT_DURATION,
        );

    setMonths(
      Array.from(
        { length: DEFAULT_MONTH_LENGTH },
        (_, i) => new Date(today.getFullYear(), today.getMonth() + i, 1),
      ),
    );

    // 선택 날짜 초기화
    setSelectedStartDate(start);
    setSelectedEndDate(end);

    // ref 초기화
    prevStartRef.current = start;
    prevEndRef.current = end;
  }, []);

  useEffect(() => {
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : selectedStartDate;
      const end = endDate ? new Date(endDate) : selectedEndDate;

      setSelectedStartDate(start);
      setSelectedEndDate(end);
      prevStartRef.current = start;
      prevEndRef.current = end;
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (
      selectedStartDate &&
      selectedEndDate &&
      (prevStartRef.current?.getTime() !== selectedStartDate.getTime() ||
        prevEndRef.current?.getTime() !== selectedEndDate.getTime())
    ) {
      const dateChangeData = {
        startDate: formatDateToString(selectedStartDate),
        endDate: formatDateToString(selectedEndDate),
      };

      if (typeof handleDateChange === 'function') {
        handleDateChange(dateChangeData);
      }

      // ref 업데이트
      prevStartRef.current = selectedStartDate;
      prevEndRef.current = selectedEndDate;
    }
  }, [selectedStartDate, selectedEndDate, handleDateChange]);

  // 날짜 관련 유틸리티 함수
  const getDaysInMonth = date =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = date =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDateForCompare = date => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 날짜를 문자열로 변환하는 함수 (YYYY-MM-DD 형식)
  const formatDateToString = date => {
    if (!date) return null;
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

    // 시작일과 종료일이 연속된 날짜일 경우 범위가 없음
    if (Math.abs(selectedEndDate - selectedStartDate) <= 86400000) return false;

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

  const isToday = date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 날짜 클릭 핸들러
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
      // 임시 날짜와 비교
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

  // 숙박 기간 계산
  const calculateStayDuration = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;

    const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // 월 렌더링
  const renderMonth = monthDate => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDayOfMonth = getFirstDayOfMonth(monthDate);
    const days = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${monthDate.toISOString()}-${i}`}
          className='h-10'
        ></div>,
      );
    }

    // 날짜 렌더링
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const isPast = isDateInPast(date);
      const isTodayDate = isToday(date);

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
          }`}
        >
          {isStart && !isEnd && (
            <div className='right absolute right-0 h-full w-1/2 bg-blue-200'></div>
          )}
          {isEnd && !isStart && (
            <div className='left absolute left-0 h-full w-1/2 bg-blue-200'></div>
          )}
          {isInRange && !isStart && !isEnd && (
            <>
              <div className='left absolute left-0 h-full w-1/2 bg-blue-200'></div>
              <div className='right absolute right-0 h-full w-1/2 bg-blue-200'></div>
            </>
          )}
          <div
            className={`relative z-10 ${
              isSelected
                ? 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white'
                : isTempSelected
                  ? 'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white'
                  : isTodayDate && !isInRange
                    ? 'mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-violet-600 text-violet-600'
                    : ''
            }`}
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

  // 선택된 범위 표시
  const renderSelectedRange = () => {
    const formatDate = date => {
      if (!date) return '선택되지 않음';
      return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
        ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
      })`;
    };

    const stayDuration = calculateStayDuration();

    return (
      <div className='mb-4 flex w-full flex-col'>
        <div className='flex justify-evenly'>
          <div className='flex flex-col items-center'>
            <div className='text-xs font-medium'>체크인</div>
            <div className='text-lg font-bold'>
              {formatDate(selectedStartDate)}
            </div>
          </div>
          <div className='text-3xl font-bold'>{'->'}</div>
          <div className='flex flex-col items-center'>
            <div className='text-xs font-medium'>체크아웃</div>
            <div className='text-lg font-bold'>
              {formatDate(selectedEndDate)}
            </div>
          </div>
        </div>

        {stayDuration > 0 && (
          <div className='mt-2 text-center text-sm'>
            <span className='font-medium text-violet-600'>
              {stayDuration}박
            </span>{' '}
            숙박
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='sticky top-0 z-20 w-full bg-white'>
        <div className='shadow-bottom z-10 mb-4 pb-2'>
          <div className='flex flex-col items-center justify-between'>
            {renderSelectedRange()}
          </div>

          <div className='mt-2 mb-2 grid grid-cols-7 gap-1 px-5'>
            {['일', '월', '화', '수', '목', '금', '토'].map(
              (weekday, index) => (
                <div
                  key={index}
                  className={`text-center text-xs font-medium ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''}`}
                >
                  {weekday}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div
        className='overflow-y-auto px-4 pb-4'
        style={{ scrollbarWidth: 'none' }}
      >
        {months.map((month, index) => (
          <div key={`month-${index}`}>{renderMonth(month)}</div>
        ))}
      </div>
    </>
  );
};

export default Calendar;
