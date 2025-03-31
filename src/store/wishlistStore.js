import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { updateWishlist, fetchWishlist } from '../firebase/userRepository';

import useAuthStore from './authStore';

const filterNullValues = array =>
  array.filter(item => item !== null && item !== undefined);

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoading: false,

      addToWishlist: async itemId => {
        if (!itemId) return;

        const { wishlist } = get();
        if (wishlist.includes(itemId)) return;

        const newWishlist = [...wishlist, itemId];
        const cleanWishlist = filterNullValues(newWishlist);

        set({ wishlist: cleanWishlist });

        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await updateWishlist(user.uid, newWishlist);
          } catch (error) {
            console.error('위시리스트 추가 오류:', error);
          }
        }
      },

      removeFromWishlist: async itemId => {
        const { wishlist } = get();
        const newWishlist = wishlist.filter(item => item !== itemId);
        const cleanWishlist = filterNullValues(newWishlist);

        set({ wishlist: cleanWishlist });

        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await updateWishlist(user.uid, newWishlist);
          } catch (error) {
            console.error('위시리스트 제거 오류:', error);
          }
        }
      },

      isInWishlist: itemId => get().wishlist.includes(itemId),

      syncWithCloud: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        set({ isLoading: true });
        try {
          const cloudWishlist = await fetchWishlist(user.uid);

          const cleanCloudWishlist = filterNullValues(cloudWishlist || []);

          const localWishlist = get().wishlist;

          const cleanLocalWishlist = filterNullValues(localWishlist);

          if (cleanLocalWishlist.length > 0) {
            const mergedItems = Array.from(
              new Set([...cleanCloudWishlist, ...cleanLocalWishlist]),
            );

            const cleanMergedItems = filterNullValues(mergedItems);

            await updateWishlist(user.uid, cleanMergedItems);
            set({ wishlist: cleanMergedItems });
          } else {
            set({ wishlist: cleanCloudWishlist });
          }
        } catch (error) {
          console.error('위시리스트 동기화 오류:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearWishlist: async () => {
        const { user } = useAuthStore.getState();
        set({ wishlist: [] });

        if (user) {
          try {
            await updateWishlist(user.uid, []);
          } catch (error) {
            console.error('위시리스트 초기화 오류:', error);
          }
        }
      },

      cleanWishlist: () => {
        const { wishlist } = get();
        const cleanWishlist = filterNullValues(wishlist);

        // 변경이 있을 때만 업데이트 진행
        if (cleanWishlist.length !== wishlist.length) {
          set({ wishlist: cleanWishlist });

          const { user } = useAuthStore.getState();
          if (user) {
            try {
              updateWishlist(user.uid, cleanWishlist);
            } catch (error) {
              console.error('위시리스트 정리 오류:', error);
            }
          }
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => state => {
        if (state) {
          const { user } = useAuthStore.getState();
          if (user) {
            useWishlistStore.getState().syncWithCloud();
          }
        }
      },
    },
  ),
);

const setupAuthListener = () => {
  useAuthStore.subscribe(
    state => state.user,
    (user, prevUser) => {
      if (user && !prevUser) {
        useWishlistStore.getState().syncWithCloud();
      }
    },
  );
};

setupAuthListener();

export default useWishlistStore;
