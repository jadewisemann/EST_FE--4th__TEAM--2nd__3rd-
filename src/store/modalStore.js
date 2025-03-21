import { create } from 'zustand';

const useModalStore = create(set => ({
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
    passwordChange: {
      isOpen: false,
      onConfirm: () => {},
    },
  },

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

  openGuestModal: (onConfirm = () => {}) =>
    set(state => ({
      modals: {
        ...state.modals,
        guest: {
          isOpen: true,
          onConfirm,
        },
      },
    })),

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

  openPasswordChangeModal: (onConfirm = () => {}) =>
    set(state => ({
      modals: {
        ...state.modals,
        passwordChange: {
          isOpen: true,
          onConfirm,
        },
      },
    })),

  closePasswordChangeModal: () =>
    set(state => ({
      modals: {
        ...state.modals,
        passwordChange: {
          ...state.modals.passwordChange,
          isOpen: false,
        },
      },
    })),
}));

export default useModalStore;
