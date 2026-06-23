import { z } from "zod";

import { orderStatuses } from "@/lib/constants/order-status";

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(80, "Customer name must be 80 characters or fewer"),
  customerPhone: z.string().regex(/^\d{10}$/, "Customer phone must be exactly 10 digits"),
  customerAddress: z
    .string()
    .trim()
    .min(5, "Customer address must be at least 5 characters")
    .max(240, "Customer address must be 240 characters or fewer"),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, "Menu item ID is required"),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be greater than 0")
          .max(20, "Quantity cannot exceed 20 per item"),
      }),
    )
    .min(1, "At least one order item is required")
    .max(50, "An order can include up to 50 item lines"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});
