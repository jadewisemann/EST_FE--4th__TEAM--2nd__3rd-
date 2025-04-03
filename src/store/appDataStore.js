import { create } from 'zustand';

const useAppDataStore = create(set => {
  const defaultDuration = 1;

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + defaultDuration);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDay = date => {
    const dayIndex = date.getDay();
    const days = {
      /* eslint-disable */
      KO: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      ko: ['일', '월', '화', '수', '목', '금', '토'],
      EN: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      /* eslint-enable */
    };

    return Object.fromEntries(
      Object.entries(days).map(([key, value]) => [key, value[dayIndex]]),
    );
  };

  return {
    dates: {
      startDate: formatDate(start),
      startDay: getDay(start),
      endDate: formatDate(end),
      endDay: getDay(end),
      duration: defaultDuration,
    },

    guests: {
      rooms: 1,
      adults: 1,
      children: 0,
      infants: 0,
    },

    updateDates: ({ startDate, endDate }) =>
      set(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInDays = Math.floor(
          (end - start) / (1000 * 60 * 60 * 24),
        );

        return {
          dates: {
            startDate,
            endDate,
            duration: durationInDays > 0 ? durationInDays : defaultDuration,
          },
        };
      }),

    updateGuests: newGuests =>
      set(state => ({
        guests: {
          ...state.guests,
          ...newGuests,
        },
      })),
  };
});

export default useAppDataStore;
