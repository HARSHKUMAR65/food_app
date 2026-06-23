import { z } from "zod";

import { orderStatuses } from "@/lib/constants/order-status";

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().regex(/^\d{10}$/, "Customer phone must be exactly 10 digits"),
  customerAddress: z
    .string()
    .trim()
    .min(5, "Customer address must be at least 5 characters"),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, "Menu item ID is required"),
        quantity: z.number().int().positive("Quantity must be greater than 0"),
      }),
    )
    .min(1, "At least one order item is required"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});
