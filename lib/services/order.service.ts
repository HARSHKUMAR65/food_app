import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateOrderInput, OrderStatusInput, OrderWithItems } from "@/types/order";

const orderWithItemsInclude = {
  items: {
    include: {
      menuItem: true,
    },
  },
} satisfies Prisma.OrderInclude;

export class MenuItemUnavailableError extends Error {
  constructor() {
    super("One or more menu items do not exist or are unavailable");
    this.name = "MenuItemUnavailableError";
  }
}

export async function createOrder(data: CreateOrderInput): Promise<OrderWithItems> {
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

  try {
    const { simulateOrderStatus } = await import("@/lib/status-simulator");
    simulateOrderStatus(order.id);
  } catch (error: unknown) {
    console.error(`Failed to start status simulation for order ${order.id}`, error);
  }

  return order;
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: orderWithItemsInclude,
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatusInput,
): Promise<OrderWithItems | null> {
  const existingOrder = await prisma.order.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingOrder) {
    return null;
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
}
