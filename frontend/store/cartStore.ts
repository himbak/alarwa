import { create } from 'zustand';

export interface CartItem {
  parfumId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  sellerId?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (parfumId: string) => void;
  updateQuantity: (parfumId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find((item) => item.parfumId === newItem.parfumId);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.parfumId === newItem.parfumId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        ),
      };
    }
    return { items: [...state.items, newItem] };
  }),
  removeItem: (parfumId) => set((state) => ({
    items: state.items.filter((item) => item.parfumId !== parfumId)
  })),
  updateQuantity: (parfumId, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.parfumId === parfumId ? { ...item, quantity } : item
    )
  })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
