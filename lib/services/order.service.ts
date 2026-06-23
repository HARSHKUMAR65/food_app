import type { Prisma } from "@/app/generated/prisma/client";
import {
  createDemoOrder,
  getDemoOrderById,
  updateDemoOrderStatus,
} from "@/lib/data/demo-orders";
import { getPrismaClient } from "@/lib/prisma";
import { isDemoDataEnabled, shouldUseDemoData } from "@/lib/services/demo-fallback";
import { MenuItemUnavailableError } from "@/lib/services/order-errors";
import type { CreateOrderInput, OrderStatusInput, OrderWithItems } from "@/types/order";

const orderWithItemsInclude = {
  items: {
    include: {
      menuItem: true,
    },
  },
} satisfies Prisma.OrderInclude;

export async function createOrder(data: CreateOrderInput): Promise<OrderWithItems> {
  try {
    const order = await createDatabaseOrder(data);
    await startStatusSimulation(order.id);

    return order;
  } catch (error: unknown) {
    if (error instanceof MenuItemUnavailableError && isDemoDataEnabled()) {
      const order = createDemoOrder(data);
      await startStatusSimulation(order.id);

      return order;
    }

    if (shouldUseDemoData(error, "create order")) {
      const order = createDemoOrder(data);
      await startStatusSimulation(order.id);

      return order;
    }

    throw error;
  }
}

async function createDatabaseOrder(data: CreateOrderInput): Promise<OrderWithItems> {
  const prisma = getPrismaClient();
  const order = await prisma.$transaction(async (tx) => {
    const uniqueMenuItemIds = [...new Set(data.items.map((item) => item.menuItemId))];

    const menuItems = await tx.menuItem.findMany({
      where: {
        id: {
          in: uniqueMenuItemIds,
        },
        isAvailable: true,
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (menuItems.length !== uniqueMenuItemIds.length) {
      throw new MenuItemUnavailableError();
    }

    const menuItemPriceById = new Map(menuItems.map((item) => [item.id, item.price]));

    const orderItems = data.items.map((item) => {
      const price = menuItemPriceById.get(item.menuItemId);

      if (price === undefined) {
        throw new MenuItemUnavailableError();
      }

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
      };
    });

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: orderWithItemsInclude,
    });
  });

  return order;
}

async function startStatusSimulation(orderId: string): Promise<void> {
  try {
    const { simulateOrderStatus } = await import("@/lib/status-simulator");
    simulateOrderStatus(orderId);
  } catch (error: unknown) {
    console.error(`Failed to start status simulation for order ${orderId}`, error);
  }
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  try {
    const prisma = getPrismaClient();
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: orderWithItemsInclude,
    });

    return order ?? (isDemoDataEnabled() ? getDemoOrderById(id) : null);
  } catch (error: unknown) {
    if (shouldUseDemoData(error, "fetch order")) {
      return getDemoOrderById(id);
    }

    throw error;
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatusInput,
): Promise<OrderWithItems | null> {
  try {
    const prisma = getPrismaClient();
    const existingOrder = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingOrder) {
      return isDemoDataEnabled() ? updateDemoOrderStatus(id, status) : null;
    }

    return prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: orderWithItemsInclude,
    });
  } catch (error: unknown) {
    if (shouldUseDemoData(error, "update order status")) {
      return updateDemoOrderStatus(id, status);
    }

    throw error;
  }
}

export { MenuItemUnavailableError };
