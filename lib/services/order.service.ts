import {
  createDemoOrder,
  getDemoOrderById,
  updateDemoOrderStatus,
} from "@/lib/data/demo-orders";
import { MenuItemUnavailableError } from "@/lib/services/order-errors";
import { withResolvedOrderStatus } from "@/lib/status-simulator";
import type { CreateOrderInput, OrderStatusInput, OrderWithItems } from "@/types/order";

export async function createOrder(data: CreateOrderInput): Promise<OrderWithItems> {
  const order = createDemoOrder(data);

  return withResolvedOrderStatus(order);
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const order = getDemoOrderById(id);

  return order ? withResolvedOrderStatus(order) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatusInput,
): Promise<OrderWithItems | null> {
  const order = updateDemoOrderStatus(id, status);

  return order ? withResolvedOrderStatus(order) : null;
}

export { MenuItemUnavailableError };
