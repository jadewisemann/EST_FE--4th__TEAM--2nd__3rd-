import { create } from 'zustand';

import { processPayment } from '../firebase/payment';

const usePaymentStore = create(set => ({
  loading: false,
  error: null,
  result: null,

  makePayment: async (userId, amount, reservationData) => {
    set({ loading: true, error: null });

    try {
      const result = await processPayment(userId, amount, reservationData);
      set({ result, loading: false });
      return result;
    } catch (error) {
      set({
        error: error.message || '결제 처리 중 오류가 발생했습니다.',
        loading: false,
      });
      throw error;
    }
  },

  resetState: () => set({ loading: false, error: null, result: null }),
}));

export default usePaymentStore;
