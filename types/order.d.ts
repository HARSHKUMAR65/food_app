import type { Prisma } from "@/app/generated/prisma/client";
import type { z } from "zod";

import type {
  createOrderSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/order.schema";

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderStatusInput = UpdateOrderStatusInput["status"];

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        menuItem: true;
      };
    };
  };
}>;
