'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartIngredient = {
  name: string;
  measure: string;
  quantity: number;
  mapped: boolean;
  itemId?: string;
};

type CartStore = {
  items: CartIngredient[];
  addIngredients: (ingredients: CartIngredient[]) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addIngredients: (ingredients) =>
        set((state) => ({
          items: [...state.items, ...ingredients],
        })),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'itemize-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
