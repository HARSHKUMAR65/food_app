import { prisma } from "@/lib/prisma";
import type { CreateMenuItemInput, CreateMenuItemsInput } from "@/types/menu";

export async function getAvailableMenuItems() {
  return prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createMenuItem(data: CreateMenuItemInput) {
  return prisma.menuItem.create({
    data: toMenuItemCreateData(data),
  });
}

export async function createMenuItems(data: CreateMenuItemsInput) {
  return prisma.$transaction((tx) =>
    Promise.all(
      data.map((item) =>
        tx.menuItem.create({
          data: toMenuItemCreateData(item),
        }),
      ),
    ),
  );
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
