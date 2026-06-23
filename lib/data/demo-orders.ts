import { findDemoMenuItems } from "@/lib/data/demo-menu";
import { MenuItemUnavailableError } from "@/lib/services/order-errors";
import type { CreateOrderInput, OrderStatusInput, OrderWithItems } from "@/types/order";

const globalForDemoOrders = globalThis as unknown as {
  demoOrders?: Map<string, OrderWithItems>;
};

function getDemoOrderStore(): Map<string, OrderWithItems> {
  globalForDemoOrders.demoOrders ??= new Map<string, OrderWithItems>();
  return globalForDemoOrders.demoOrders;
}

function createId(prefix: string): string {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createDemoOrder(data: CreateOrderInput): OrderWithItems {
  const uniqueMenuItemIds = [...new Set(data.items.map((item) => item.menuItemId))];
  const menuItems = findDemoMenuItems(uniqueMenuItemIds);

  if (menuItems.length !== uniqueMenuItemIds.length) {
    throw new MenuItemUnavailableError();
  }

  const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
  const createdAt = new Date();
  const orderId = createId("demo-order");

  const items = data.items.map((item) => {
    const menuItem = menuItemById.get(item.menuItemId);

    if (!menuItem) {
      throw new MenuItemUnavailableError();
    }

    return {
      id: createId("demo-item"),
      orderId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: menuItem.price,
      menuItem,
    };
  });

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const order: OrderWithItems = {
    id: orderId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    status: "ORDER_RECEIVED",
    totalAmount,
    createdAt,
    updatedAt: createdAt,
    items,
  };

  getDemoOrderStore().set(order.id, order);
  return order;
}

export function getDemoOrderById(id: string): OrderWithItems | null {
  return getDemoOrderStore().get(id) ?? null;
}

export function updateDemoOrderStatus(
  id: string,
  status: OrderStatusInput,
): OrderWithItems | null {
  const order = getDemoOrderById(id);

  if (!order) {
    return null;
  }

  const updatedOrder: OrderWithItems = {
    ...order,
    status,
    updatedAt: new Date(),
  };

  getDemoOrderStore().set(id, updatedOrder);
  return updatedOrder;
}
