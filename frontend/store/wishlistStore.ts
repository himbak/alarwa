import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  parfumId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (parfumId: string) => void;
  isWishlisted: (parfumId: string) => boolean;
  toggle: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: state.items.find(i => i.parfumId === item.parfumId) ? state.items : [...state.items, item]
      })),
      removeItem: (parfumId) => set((state) => ({
        items: state.items.filter(i => i.parfumId !== parfumId)
      })),
      isWishlisted: (parfumId) => get().items.some(i => i.parfumId === parfumId),
      toggle: (item) => {
        const exists = get().items.some(i => i.parfumId === item.parfumId);
        if (exists) {
          set(state => ({ items: state.items.filter(i => i.parfumId !== item.parfumId) }));
        } else {
          set(state => ({ items: [...state.items, item] }));
        }
      }
    }),
    {
      name: 'parfum-wishlist', // localStorage key
    }
  )
);
