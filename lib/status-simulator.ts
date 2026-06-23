import type { OrderStatus } from "@/types/food-order";
import type { OrderWithItems } from "@/types/order";

const statusTimeline = [
  {
    elapsedMs: 0,
    status: "ORDER_RECEIVED",
  },
  {
    elapsedMs: 10_000,
    status: "PREPARING",
  },
  {
    elapsedMs: 20_000,
    status: "OUT_FOR_DELIVERY",
  },
  {
    elapsedMs: 30_000,
    status: "DELIVERED",
  },
] satisfies readonly {
  elapsedMs: number;
  status: Exclude<OrderStatus, "CANCELLED">;
}[];

const statusRank: Record<OrderStatus, number> = {
  ORDER_RECEIVED: 0,
  PREPARING: 1,
  OUT_FOR_DELIVERY: 2,
  DELIVERED: 3,
  CANCELLED: 4,
};

export function getElapsedOrderStatus(
  createdAt: Date | string,
  now: Date = new Date(),
): Exclude<OrderStatus, "CANCELLED"> {
  const createdAtTime =
    createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  const elapsedMs = Math.max(0, now.getTime() - createdAtTime);

  return statusTimeline.reduce<Exclude<OrderStatus, "CANCELLED">>(
    (currentStatus, timelineEntry) =>
      elapsedMs >= timelineEntry.elapsedMs ? timelineEntry.status : currentStatus,
    "ORDER_RECEIVED",
  );
}

export function resolveOrderStatus(
  order: Pick<OrderWithItems, "createdAt" | "status">,
  now: Date = new Date(),
): OrderStatus {
  if (order.status === "CANCELLED") {
    return "CANCELLED";
  }

  const elapsedStatus = getElapsedOrderStatus(order.createdAt, now);

  return statusRank[order.status] > statusRank[elapsedStatus]
    ? order.status
    : elapsedStatus;
}

export function withResolvedOrderStatus<T extends OrderWithItems>(
  order: T,
  now: Date = new Date(),
): T {
  return {
    ...order,
    status: resolveOrderStatus(order, now),
  };
}
