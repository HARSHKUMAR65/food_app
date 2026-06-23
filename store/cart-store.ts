import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartState } from "@/types/cart";

const cartStorage =
  typeof window === "undefined" ? undefined : createJSONStorage<CartState>(() => localStorage);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const quantityToAdd = item.quantity ?? 1;

        set((state) => {
          const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantityToAdd,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: quantityToAdd,
              },
            ],
          };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        }));
      },
      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalAmount: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "food-app-cart",
      storage: cartStorage,
    },
  ),
);
