import { useEffect } from 'react';

import { create } from 'zustand';

import { reservationService } from '../firebase/service';

import useAuthStore from './authStore';

const useReservationStore = create(set => ({
  reservations: [],
  loading: false,
  error: null,

  fetchUserReservations: async userId => {
    if (!userId) {
      set({ reservations: [], error: null });
      return;
    }

    set({ loading: true });

    try {
      const reservationsData =
        await reservationService.getUserReservations(userId);

      set({
        reservations: reservationsData,
        loading: false,
        error: null,
      });

      return reservationsData;
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },

  clearReservations: () => {
    set({ reservations: [], error: null });
  },
}));

export const useReservationWithAuth = () => {
  const {
    reservations,
    loading,
    error,
    fetchUserReservations,
    clearReservations,
  } = useReservationStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      fetchUserReservations(user.uid);
    } else {
      clearReservations();
    }
  }, [user]);

  return { reservations, loading, error };
};

export default useReservationStore;
