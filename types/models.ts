import type { OrderStatus } from "@/types/food-order";

export type MenuItemRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemWithMenu = {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem: MenuItemRecord;
};

export type OrderWithItems = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemWithMenu[];
};
