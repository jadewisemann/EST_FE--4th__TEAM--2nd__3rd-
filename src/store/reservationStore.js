import { useEffect, useCallback } from 'react';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import useAuthStore from '../store/authStore';

import { getRoomById } from '../firebase/searchQuery';
import { getUserReservations } from '../firebase/userRepository';

import { requestPayment } from '../services/paymentService';

const ERR_MSG = {
  NOT_VALID_TRANSITION: '유효하지 않은 상태 전이입니다',
  PAYMENT_DATA_OMISSION: '결제에 필요한 정보가 준비되지 않았습니다',
  PAYMENT_FAILURE: '결제 처리에 실패했습니다',
  SESSION_EXPIRED: '세션이 만료되었습니다',
  USER_NOT_AUTHENTICATED: '사용자 인증이 필요합니다',
  VALIDATION_FAILED: '사용자 입력 검증에 실패했습니다',
  VALIDATE_INPUT: {
    MISSING_NAME: '이름은 필수 입력 항목입니다',
    NOT_VALID_PHONE_NUMBER: '유효한 전화번호를 입력해주세요',
    NOT_VALID_EMAIL: '유효한 이메일 주소를 입력해주세요',
    MISSING_AGREEMENT: '결제 약관에 동의해주세요',
  },
};

const SESSION_MAX_AGE = 30 * 60 * 1000; // 30분

const STATE = {
  IDLE: 'IDLE',
  DATA_LOADED: 'DATA_LOADED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
};

const validateUserInput = userInput => {
  const errors = {};

  // agreement: true
  // checkIn: "2025-03-27"
  // checkOut: "2025-03-29"
  // guestCount: 1
  // paymentMethod: "card"
  // email: "test@test.com"
  // name: "test"
  // phone: "010-1111-2222"
  // request: "test"
  if (!userInput.name || userInput.name.trim() === '') {
    errors.name = ERR_MSG.VALIDATE_INPUT.MISSING_NAME;
  }

  if (
    !userInput.phone
    || !/^\d{10,11}$/.test(userInput.phone.replace(/-/g, ''))
  ) {
    errors.phone = ERR_MSG.VALIDATE_INPUT.NOT_VALID_PHONE_NUMBER;
  }

  if (!userInput.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput.email)) {
    errors.email = ERR_MSG.VALIDATE_INPUT.NOT_VALID_EMAIL;
  }

  if (!userInput.agreement) {
    errors.agreement = ERR_MSG.VALIDATE_INPUT.MISSING_AGREEMENT;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const useReservationStore = create(
  persist(
    (set, get) => ({
      currentState: STATE.IDLE,
      transactionId: null,
      createdAt: Date.now(),
      stateTimestamps: {
        [STATE.IDLE]: Date.now(),
        [STATE.DATA_LOADED]: null,
        [STATE.PROCESSING]: null,
        [STATE.COMPLETED]: null,
        [STATE.ERROR]: null,
      },
      roomId: null,
      roomData: null,
      userData: null,
      userInput: null,
      error: null,
      paymentResult: null,
      loading: false,
      reservations: [],

      validateSession: () => {
        const { createdAt } = get();
        return Date.now() - createdAt <= SESSION_MAX_AGE;
      },

      canTransitionTo: nextState => {
        const { currentState } = get();
        const validTransitions = {
          [STATE.IDLE]: [STATE.DATA_LOADED, STATE.ERROR],
          [STATE.DATA_LOADED]: [STATE.PROCESSING, STATE.IDLE, STATE.ERROR],
          [STATE.PROCESSING]: [STATE.COMPLETED, STATE.ERROR],
          [STATE.COMPLETED]: [STATE.IDLE],
          [STATE.ERROR]: [STATE.IDLE, STATE.DATA_LOADED],
        };
        return validTransitions[currentState]?.includes(nextState) || false;
      },

      transition: (nextState, data = {}) => {
        const { canTransitionTo, currentState } = get();
        if (!canTransitionTo(nextState)) {
          console.error(
            `${ERR_MSG.NOT_VALID_TRANSITION}: ${currentState} => ${nextState}`,
          );
          return false;
        }

        set(state => ({
          currentState: nextState,
          stateTimestamps: {
            ...state.stateTimestamps,
            [nextState]: Date.now(),
          },
          ...data,
        }));
        return true;
      },

      loadRoomData: async roomUid => {
        const { transition, validateSession } = get();
        const { user } = useAuthStore.getState();

        if (!user) {
          set({
            currentState: STATE.ERROR,
            error: ERR_MSG.USER_NOT_AUTHENTICATED,
          });
          return { success: false, error: ERR_MSG.USER_NOT_AUTHENTICATED };
        }

        if (!validateSession()) {
          set({
            currentState: STATE.ERROR,
            error: ERR_MSG.SESSION_EXPIRED,
          });
          return { success: false, error: ERR_MSG.SESSION_EXPIRED };
        }

        try {
          const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
          const roomData = await getRoomById(roomUid);

          if (!roomData) {
            transition(STATE.ERROR, { error: '객실 정보를 찾을 수 없습니다' });
            return { success: false, error: '객실 정보를 찾을 수 없습니다' };
          }

          transition(STATE.DATA_LOADED, {
            roomId: roomUid,
            roomData,
            transactionId,
            userData: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            },
            createdAt: Date.now(),
          });

          return { success: true, data: roomData };
        } catch (error) {
          transition(STATE.ERROR, {
            error: error.message || '객실 정보 로드 중 오류가 발생했습니다',
          });
          return { success: false, error: error.message };
        }
      },

      submitPayment: async userInput => {
        const { transition, validateSession, roomId, userData, transactionId } =
          get();

        if (!validateSession()) {
          return { success: false, error: ERR_MSG.SESSION_EXPIRED };
        }

        console.log('userInput', userInput);
        console.log('typeof userInput', typeof userInput);

        const validation = validateUserInput(userInput);
        if (!validation.isValid) {
          transition(STATE.ERROR, {
            error: {
              message: ERR_MSG.VALIDATION_FAILED,
              details: validation.errors,
            },
          });
          return { success: false, error: validation.errors };
        }

        if (!roomId || !userData) {
          transition(STATE.ERROR, { error: ERR_MSG.PAYMENT_DATA_OMISSION });
          return { success: false, error: ERR_MSG.PAYMENT_DATA_OMISSION };
        }

        transition(STATE.PROCESSING, { userInput });

        try {
          const paymentData = {
            user: userData,
            roomId: roomId,
            userInput,
            transactionId,
            timestamp: Date.now(),
          };

          console.log('paymentData', paymentData);
          console.log('typeof paymentData', typeof paymentData);
          const result = await requestPayment(paymentData);

          if (result.success) {
            transition(STATE.COMPLETED, { paymentResult: result });
          } else {
            transition(STATE.ERROR, {
              error: result.error || ERR_MSG.PAYMENT_FAILURE,
              paymentResult: result,
            });
          }

          return result;
        } catch (error) {
          transition(STATE.ERROR, {
            error: error.message || ERR_MSG.PAYMENT_FAILURE,
          });
          return { success: false, error: error.message };
        }
      },

      resetSession: () => {
        set({
          currentState: STATE.IDLE,
          transactionId: null,
          createdAt: Date.now(),
          stateTimestamps: {
            [STATE.IDLE]: Date.now(),
            [STATE.DATA_LOADED]: null,
            [STATE.PROCESSING]: null,
            [STATE.COMPLETED]: null,
            [STATE.ERROR]: null,
          },
          roomId: null,
          userData: null,
          userInput: null,
          error: null,
          paymentResult: null,
        });
        return true;
      },

      recoverFromError: () => {
        const { transition, roomId } = get();
        set({ createdAt: Date.now() });

        return roomId
          ? transition(STATE.DATA_LOADED, { userInput: null, error: null })
          : transition(STATE.IDLE, { error: null });
      },

      fetchUserReservations: async (userId = null) => {
        const { user } = useAuthStore.getState();
        const userIdToUse = userId || (user ? user.uid : null);

        if (!userIdToUse) {
          set({
            reservations: [],
            loading: false,
            error: ERR_MSG.USER_NOT_AUTHENTICATED,
          });
          return { success: false, error: ERR_MSG.USER_NOT_AUTHENTICATED };
        }

        set({ loading: true });

        try {
          const reservationsData = await getUserReservations(userIdToUse);

          set({
            reservations: reservationsData,
            loading: false,
            error: null,
          });

          return { success: true, data: reservationsData };
        } catch (error) {
          set({
            loading: false,
            error:
              error.message || '예약 정보를 가져오는 중 오류가 발생했습니다',
            reservations: [],
          });
          return { success: false, error: error.message };
        }
      },

      clearReservations: () => {
        set({ reservations: [], loading: false, error: null });
      },

      getStateInfo: () => {
        const {
          currentState,
          error,
          paymentResult,
          roomId,
          userData,
          userInput,
        } = get();
        return {
          currentState,
          error,
          paymentResult,
          hasRoomId: !!roomId,
          hasUserData: !!userData,
          hasUserInput: !!userInput,
        };
      },
    }),

    {
      name: 'payment-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        currentState: state.currentState,
        transactionId: state.transactionId,
        createdAt: state.createdAt,
        stateTimestamps: state.stateTimestamps,
        roomId: state.roomId,
        userData: state.userData,
        userInput: state.userInput,
      }),
    },
  ),
);

// 사용자 예약 정보만 처리하는 전용 훅
export const useUserReservations = () => {
  const reservations = useReservationStore(state => state.reservations);
  const loading = useReservationStore(state => state.loading);
  const error = useReservationStore(state => state.error);

  const fetchReservations = useReservationStore(
    state => state.fetchUserReservations,
  );

  const user = useAuthStore(state => state.user);

  const refreshReservations = useCallback(() => {
    if (user) {
      return fetchReservations(user.uid);
    }
    return Promise.resolve({ success: false, error: '인증되지 않은 사용자' });
  }, [user, fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refreshReservations,
    isAuthenticated: !!user,
  };
};

export const useReservationWithAuth = () => {
  const { reservations, loading, error, refreshReservations, isAuthenticated } =
    useUserReservations();

  useEffect(() => {
    refreshReservations();
  }, [isAuthenticated, refreshReservations]);

  return { reservations, loading, error };
};

export default useReservationStore;
