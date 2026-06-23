import type { z } from "zod";

import type {
  createMenuItemSchema,
  createMenuItemsSchema,
} from "@/lib/validations/menu.schema";

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type CreateMenuItemsInput = z.infer<typeof createMenuItemsSchema>;
