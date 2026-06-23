import { getOrderById, updateOrderStatus } from "@/lib/services/order.service";
import type { OrderStatusInput } from "@/types/order";

const statusTransitions = [
  {
    delayMs: 10_000,
    status: "PREPARING",
  },
  {
    delayMs: 20_000,
    status: "OUT_FOR_DELIVERY",
  },
  {
    delayMs: 30_000,
    status: "DELIVERED",
  },
] satisfies readonly {
  delayMs: number;
  status: OrderStatusInput;
}[];

export function simulateOrderStatus(orderId: string): void {
  statusTransitions.forEach(({ delayMs, status }) => {
    setTimeout(() => {
      void updateStatusIfOrderIsActive(orderId, status);
    }, delayMs);
  });
}

async function updateStatusIfOrderIsActive(
  orderId: string,
  status: OrderStatusInput,
): Promise<void> {
  try {
    const order = await getOrderById(orderId);

    if (!order || order.status === "CANCELLED" || order.status === "DELIVERED") {
      return;
    }

    await updateOrderStatus(orderId, status);
  } catch (error: unknown) {
    console.error(`Failed to simulate status ${status} for order ${orderId}`, error);
  }
}
