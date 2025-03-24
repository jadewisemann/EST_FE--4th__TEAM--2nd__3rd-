import { create } from 'zustand';

const useSearchStore = create(set => ({
  hotelIds: [],
  name: '',
  selectedCategory: '',
  fromToDate: '',
  totalNights: '',
  numOfPeople: '',
  setSearchState: data => set(state => ({ ...state, ...data })),
}));

export default useSearchStore;
