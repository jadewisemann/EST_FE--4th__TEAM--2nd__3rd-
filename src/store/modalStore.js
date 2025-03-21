import { create } from 'zustand';

const useModalStore = create(set => ({
  // 모달 상태 관리
  modals: {
    search: {
      isOpen: false,
      onConfirm: () => {},
    },
    date: {
      isOpen: false,
      onConfirm: () => {},
    },
    guest: {
      isOpen: false,
      onConfirm: () => {},
    },
  },

  // 검색 모달 열기
  openSearchModal: (onConfirm = () => {}) =>
    set(state => ({
      modals: {
        ...state.modals,
        search: {
          isOpen: true,
          onConfirm,
        },
      },
    })),

  // 검색 모달 닫기
  closeSearchModal: () =>
    set(state => ({
      modals: {
        ...state.modals,
        search: {
          ...state.modals.search,
          isOpen: false,
        },
      },
    })),

  // 날짜 모달 열기
  openDateModal: (onConfirm = () => {}) =>
    set(state => ({
      modals: {
        ...state.modals,
        date: {
          isOpen: true,
          onConfirm,
        },
      },
    })),

  // 날짜 모달 닫기
  closeDateModal: () =>
    set(state => ({
      modals: {
        ...state.modals,
        date: {
          ...state.modals.date,
          isOpen: false,
        },
      },
    })),

  // 게스트 모달 열기
  openGuestModal: (onConfirm = null) =>
    set(state => ({
      modals: {
        ...state.modals,
        guest: {
          isOpen: true,
          onConfirm,
        },
      },
    })),

  // 게스트 모달 닫기
  closeGuestModal: () =>
    set(state => ({
      modals: {
        ...state.modals,
        guest: {
          ...state.modals.guest,
          isOpen: false,
        },
      },
    })),
}));

export default useModalStore;
