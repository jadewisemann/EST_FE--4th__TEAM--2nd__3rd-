import { create } from 'zustand';

const useDateStore = create(set => {
  // 기본 기간 설정
  const defaultDuration = 1;

  // 초기 날짜 계산
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + defaultDuration);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    // 날짜 상태
    date: {
      startDate: formatDate(start),
      endDate: formatDate(end),
      duration: defaultDuration,
    },

    // 날짜 업데이트 함수
    updateDates: ({ startDate, endDate }) =>
      set(state => {
        // 새 시작일과 종료일로 기간 계산
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInDays = Math.floor(
          (end - start) / (1000 * 60 * 60 * 24),
        );

        return {
          date: {
            ...state.date,
            startDate,
            endDate,
            duration: durationInDays > 0 ? durationInDays : defaultDuration,
          },
        };
      }),
  };
});

export default useDateStore;
