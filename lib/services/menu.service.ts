import {
  createDemoMenuItem,
  createDemoMenuItems,
  getDemoMenuItems,
} from "@/lib/data/demo-menu";
import type { CreateMenuItemInput, CreateMenuItemsInput } from "@/types/menu";

export async function getAvailableMenuItems() {
  return getDemoMenuItems();
}

export async function createMenuItem(data: CreateMenuItemInput) {
  return createDemoMenuItem(data);
}

export async function createMenuItems(data: CreateMenuItemsInput) {
  return createDemoMenuItems(data);
}
