import { create } from 'zustand';

const useGuestStore = create(set => ({
  // 투숙객 정보
  guests: {
    rooms: 1,
    adults: 1,
    children: 0,
    infants: 0,
  },

  // 투숙객 업데이트 함수
  updateGuests: newGuests =>
    set(state => ({
      guests: {
        ...state.guests,
        ...newGuests,
      },
    })),
}));

export default useGuestStore;
