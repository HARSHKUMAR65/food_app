import type { MenuItem } from "@/app/generated/prisma/client";
import type { CreateMenuItemInput, CreateMenuItemsInput } from "@/types/menu";

const seedDate = new Date("2026-01-01T00:00:00.000Z");

const initialDemoMenuItems: MenuItem[] = [
  {
    id: "demo-truffle-pizza",
    name: "Truffle Mushroom Pizza",
    description: "Stone-baked base, roasted mushrooms, mozzarella, basil, and truffle oil.",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "demo-paneer-bowl",
    name: "Paneer Tikka Rice Bowl",
    description: "Charred paneer, saffron rice, pickled onions, mint chutney, and salad.",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "demo-butter-chicken",
    name: "Butter Chicken Meal",
    description: "Slow-cooked chicken makhani with jeera rice, naan, and kachumber.",
    price: 389,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "demo-sushi-platter",
    name: "Crunchy Sushi Platter",
    description: "Assorted rolls with avocado, cucumber, spicy mayo, and crisp tempura.",
    price: 529,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "demo-falafel-wrap",
    name: "Falafel Garden Wrap",
    description: "Herbed falafel, hummus, crunchy greens, tahini, and pickled vegetables.",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: "demo-chocolate-tart",
    name: "Dark Chocolate Tart",
    description: "Silky chocolate ganache, almond crust, sea salt, and berry compote.",
    price: 219,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

const globalForDemoMenu = globalThis as unknown as {
  demoMenuItems?: MenuItem[];
};

function getDemoMenuStore(): MenuItem[] {
  globalForDemoMenu.demoMenuItems ??= [...initialDemoMenuItems];
  return globalForDemoMenu.demoMenuItems;
}

export function getDemoMenuItems(): MenuItem[] {
  return getDemoMenuStore()
    .filter((item) => item.isAvailable)
    .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime());
}

export function findDemoMenuItems(ids: string[]): MenuItem[] {
  const requestedIds = new Set(ids);
  return getDemoMenuStore().filter(
    (item) => requestedIds.has(item.id) && item.isAvailable,
  );
}

export function createDemoMenuItem(data: CreateMenuItemInput): MenuItem {
  const createdAt = new Date();
  const item: MenuItem = {
    id: `demo-${createdAt.getTime()}-${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    isAvailable: data.isAvailable,
    createdAt,
    updatedAt: createdAt,
  };

  getDemoMenuStore().push(item);
  return item;
}

export function createDemoMenuItems(data: CreateMenuItemsInput): MenuItem[] {
  return data.map((item) => createDemoMenuItem(item));
}
