import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 캘린더 컴포넌트
 */
const Calendar = ({ startDate, endDate, onChange }) => {
  const DEFAULT_DURATION = 1;
  const DEFAULT_MONTH_LENGTH = 12;

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [months, setMonths] = useState([]);

  const prevStartRef = useRef();
  const prevEndRef = useRef();
  const isInternalChangeRef = useRef(false);

  // 컴포넌트 초기화, 마운트 시점에만 실행
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 달 생성
    setMonths(
      Array.from(
        { length: DEFAULT_MONTH_LENGTH },
        (_, i) => new Date(today.getFullYear(), today.getMonth() + i, 1),
      ),
    );

    // 시작일, 종료일 설정 및 상태, ref로 지정
    const start = startDate ? new Date(startDate) : today;
    const end = endDate
      ? new Date(endDate)
      : new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + DEFAULT_DURATION,
        );

    setSelectedStartDate(start);
    setSelectedEndDate(end);

    prevStartRef.current = start;
    prevEndRef.current = end;
  }, []);

  // props 변경시 실행
  useEffect(() => {
    if (startDate || endDate) {
      // props에서 새로운 날짜 가져오기
      const start = startDate ? new Date(startDate) : selectedStartDate;
      const end = endDate ? new Date(endDate) : selectedEndDate;

      // 내부 변경 플래그 설정
      isInternalChangeRef.current = true;

      setSelectedStartDate(start);
      setSelectedEndDate(end);

      prevStartRef.current = start;
      prevEndRef.current = end;
    }
  }, [startDate, endDate]);

  // 선택된 날짜가 변경 && 두 날짜가 모두 존재 : onChange 실행
  useEffect(() => {
    // 예외: 날짜 없음 && 내부 변경이 true가 아님
    if (!selectedStartDate || !selectedEndDate || isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    const dateChangeData = {
      startDate: formatDateToString(selectedStartDate),
      endDate: formatDateToString(selectedEndDate),
    };

    if (typeof onChange === 'function') {
      onChange(dateChangeData);
    }

    prevStartRef.current = selectedStartDate;
    prevEndRef.current = selectedEndDate;
  }, [selectedStartDate, selectedEndDate]);

  const formatDateToString = useCallback(date => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

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

  const isSunday = date => date.getDay() === 0;

  const isSaturday = date => date.getDay() === 6;

  const isFirstDayOfMonth = date => date.getDate() === 1;

  const isLastDayOfMonth = date => {
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    return date.getDate() === lastDay;
  };

  const handleDateClick = (day, monthDate) => {
    // Date 객체로 변환
    const clickedDate = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      day,
    );

    // 예외처리: 오늘 이전
    if (isDateInPast(clickedDate)) return;

    // tempDate가 없으면 이번 선택이 tempDate
    if (!tempDate) {
      setSelectedStartDate(null);
      setSelectedEndDate(null);

      setTempDate(clickedDate);
    }

    // tempDate가 있으면 tempDate랑 이번 선택이 일정
    else {
      // 두 날을 시간 순서로 출발일 도착일로 지정
      const [start, end] =
        clickedDate.getTime() < tempDate.getTime()
          ? [clickedDate, tempDate]
          : [tempDate, clickedDate];
      setSelectedStartDate(start);
      setSelectedEndDate(end);

      setTempDate(null);
    }
  };

  const calculateStayDuration = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;

    const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const renderMonth = monthDate => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDayOfMonth = getFirstDayOfMonth(monthDate);

    const styles = {
      dateCell: {
        base: 'relative flex h-10 items-center justify-center gap-0',
        past: 'cursor-not-allowed text-neutral-300',
        active: 'cursor-pointer',
      },
      dateNumber: {
        base: 'relative z-1',
        selected:
          'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white',
        today:
          'mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-violet-600 text-violet-600',
        range:
          'mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 text-neutral-500',
      },
      range: {
        left: 'absolute left-0 h-full w-1/2 bg-blue-200',
        right: 'absolute right-0 h-full w-1/2 bg-blue-200',
      },
    };

    // 빈 날짜 생성
    const days = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className='h-10'></div>
    ));

    // 실제 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

      // 날짜 조건 확인
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

      // 날짜 조건 확인
      const isSundayDate = isSunday(date);
      const isSaturdayDate = isSaturday(date);
      const isFirstDay = isFirstDayOfMonth(date);
      const isLastDay = isLastDayOfMonth(date);

      // 날짜 cell 생성
      const cellClass = `${styles.dateCell.base} ${isPast ? styles.dateCell.past : styles.dateCell.active}`;

      // 숫자 스타일 생성
      const numberClass = `
        ${styles.dateNumber.base} 
        ${isSelected || isTempSelected ? styles.dateNumber.selected : ''}
        ${isTodayDate && !isInRange ? styles.dateNumber.today : ''}
        ${isInRange && styles.dateNumber.range}
      `.trim();

      // 날짜 셀에 적용할 배경 스타일 결정
      const renderRangeBackground = () => {
        if (isStart && isEnd) return null;

        if (isInRange && !isStart && !isEnd) {
          if (isSundayDate || isFirstDay)
            return <div className={styles.range.right}></div>;
          if (isSaturdayDate || isLastDay)
            return <div className={styles.range.left}></div>;

          return (
            <>
              <div className={styles.range.left}></div>
              <div className={styles.range.right}></div>
            </>
          );
        }

        if (isStart && !isEnd && !(isSaturdayDate || isLastDay)) {
          return <div className={styles.range.right}></div>;
        }

        if (isEnd && !isStart && !(isSundayDate || isFirstDay)) {
          return <div className={styles.range.left}></div>;
        }

        return null;
      };

      days.push(
        <div
          key={`day-${day}`}
          onClick={() => !isPast && handleDateClick(day, monthDate)}
          className={cellClass}
        >
          {renderRangeBackground()}
          <div className={numberClass}>{day}</div>
        </div>,
      );
    }

    return (
      <div className='mb-8'>
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

  const renderWeekdayHeader = () => (
    <div className='mt-2 mb-2 grid w-full grid-cols-7 gap-1 px-5'>
      {['일', '월', '화', '수', '목', '금', '토'].map((weekday, index) => (
        <div
          key={index}
          className={`text-center text-xs font-medium ${
            index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
          }`}
        >
          {weekday}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className='shadow-bottom sticky top-0 z-2 mb-4 flex w-full flex-col items-center justify-between bg-white pb-2'>
        {renderSelectedRange()}
        {renderWeekdayHeader()}
      </div>

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
