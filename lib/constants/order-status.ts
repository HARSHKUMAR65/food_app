import type { OrderStatus } from "@/types/food-order";

export const orderStatuses = [
  "ORDER_RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const satisfies readonly OrderStatus[];

export const orderStatusLabels: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "Order received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
