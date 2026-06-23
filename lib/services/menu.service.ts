import {
  createDemoMenuItem,
  createDemoMenuItems,
  getDemoMenuItems,
} from "@/lib/data/demo-menu";
import { getPrismaClient } from "@/lib/prisma";
import { isDemoDataEnabled, shouldUseDemoData } from "@/lib/services/demo-fallback";
import type { CreateMenuItemInput, CreateMenuItemsInput } from "@/types/menu";

export async function getAvailableMenuItems() {
  try {
    const prisma = getPrismaClient();
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (menuItems.length === 0 && isDemoDataEnabled()) {
      return getDemoMenuItems();
    }

    return menuItems;
  } catch (error: unknown) {
    if (shouldUseDemoData(error, "fetch menu items")) {
      return getDemoMenuItems();
    }

    throw error;
  }
}

export async function createMenuItem(data: CreateMenuItemInput) {
  try {
    const prisma = getPrismaClient();
    return await prisma.menuItem.create({
      data: toMenuItemCreateData(data),
    });
  } catch (error: unknown) {
    if (shouldUseDemoData(error, "create menu item")) {
      return createDemoMenuItem(data);
    }

    throw error;
  }
}

export async function createMenuItems(data: CreateMenuItemsInput) {
  try {
    const prisma = getPrismaClient();
    return await prisma.$transaction((tx) =>
      Promise.all(
        data.map((item) =>
          tx.menuItem.create({
            data: toMenuItemCreateData(item),
          }),
        ),
      ),
    );
  } catch (error: unknown) {
    if (shouldUseDemoData(error, "create menu items")) {
      return createDemoMenuItems(data);
    }

    throw error;
  }
}

function toMenuItemCreateData(data: CreateMenuItemInput) {
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    isAvailable: data.isAvailable,
  };
}
