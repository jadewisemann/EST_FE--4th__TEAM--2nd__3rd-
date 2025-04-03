import { create } from 'zustand';

const useToastStore = create(set => ({
  message: '',
  className: '',
  showToast: (msg, className = '') => {
    set({ message: msg, className });
    setTimeout(() => set({ message: '', className: '' }), 2000);
  },
}));

export default useToastStore;
