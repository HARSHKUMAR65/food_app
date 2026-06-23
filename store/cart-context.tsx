"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AddCartItem, CartItem, CartState } from "@/types/cart";

const cartStorageKey = "food-app-cart";

type PersistedCart = {
  items: CartItem[];
};

type AuthContextValue = CartState & {
  itemCount: number;
  totalAmount: number;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const rawCart = window.localStorage.getItem(cartStorageKey);

    if (!rawCart) {
      return [];
    }

    const parsedCart = JSON.parse(rawCart) as Partial<PersistedCart>;
    return Array.isArray(parsedCart.items) ? parsedCart.items : [];
  } catch {
    return [];
  }
}

function addCartItem(items: CartItem[], item: AddCartItem): CartItem[] {
  const quantityToAdd = item.quantity ?? 1;
  const existingItem = items.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    return items.map((cartItem) =>
      cartItem.id === item.id
        ? {
            ...cartItem,
            quantity: cartItem.quantity + quantityToAdd,
          }
        : cartItem,
    );
  }

  return [
    ...items,
    {
      ...item,
      quantity: quantityToAdd,
    },
  ];
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setItems(readStoredCart());
      setHasLoadedStoredCart(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify({ items }));
  }, [hasLoadedStoredCart, items]);

  const addItem = useCallback((item: AddCartItem) => {
    setItems((currentItems) => addCartItem(currentItems, item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      items,
      itemCount,
      totalAmount,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotalAmount: () => totalAmount,
    }),
    [
      addItem,
      clearCart,
      decreaseQuantity,
      increaseQuantity,
      itemCount,
      items,
      removeItem,
      totalAmount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
