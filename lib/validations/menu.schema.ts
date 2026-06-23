import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Menu item name must be at least 2 characters")
    .max(80, "Menu item name must be 80 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(5, "Menu item description must be at least 5 characters")
    .max(240, "Menu item description must be 240 characters or fewer"),
  price: z
    .number()
    .int()
    .positive("Menu item price must be greater than 0")
    .max(100_000, "Menu item price is too high"),
  image: z
    .string()
    .trim()
    .min(1, "Menu item image is required")
    .max(2_000, "Menu item image URL is too long"),
  isAvailable: z.boolean().optional().default(true),
});

export const createMenuItemsSchema = z
  .array(createMenuItemSchema)
  .min(1, "At least one menu item is required")
  .max(100, "You can create up to 100 menu items at once");

export const createMenuItemRequestSchema = z.union([
  createMenuItemSchema.transform((item) => ({
    type: "single" as const,
    item,
  })),
  createMenuItemsSchema.transform((items) => ({
    type: "bulk" as const,
    items,
  })),
  z
    .object({
      items: createMenuItemsSchema,
    })
    .transform((payload) => ({
      type: "bulk" as const,
      items: payload.items,
    })),
]);
