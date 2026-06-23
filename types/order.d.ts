import type { z } from "zod";

import type {
  createOrderSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/order.schema";
import type { OrderWithItems as OrderWithItemsRecord } from "@/types/models";

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderStatusInput = UpdateOrderStatusInput["status"];
export type OrderWithItems = OrderWithItemsRecord;
