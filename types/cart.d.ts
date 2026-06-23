export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type AddCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: AddCartItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};
