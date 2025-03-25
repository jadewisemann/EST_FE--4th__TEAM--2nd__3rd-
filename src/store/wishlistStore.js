import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { updateUserWishlist, getUserWishlist } from '../firebase/wishlist';

import useAuthStore from './authStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoading: false,

      addToWishlist: async itemId => {
        const { wishlist } = get();
        if (wishlist.includes(itemId)) return;

        const newWishlist = [...wishlist, itemId];
        set({ wishlist: newWishlist });

        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await updateUserWishlist(user.uid, newWishlist);
          } catch (error) {
            console.error('위시리스트 추가 오류:', error);
          }
        }
      },

      removeFromWishlist: async itemId => {
        const { wishlist } = get();
        const newWishlist = wishlist.filter(item => item !== itemId);
        set({ wishlist: newWishlist });

        const { user } = useAuthStore.getState();
        if (user) {
          try {
            await updateUserWishlist(user.uid, newWishlist);
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
          const cloudWishlist = await getUserWishlist(user.uid);
          const localWishlist = get().wishlist;

          if (localWishlist.length > 0) {
            const mergedItems = Array.from(
              new Set([...cloudWishlist, ...localWishlist]),
            );
            await updateUserWishlist(user.uid, mergedItems);
            set({ wishlist: mergedItems });
          } else {
            set({ wishlist: cloudWishlist });
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
            await updateUserWishlist(user.uid, []);
          } catch (error) {
            console.error('위시리스트 초기화 오류:', error);
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
