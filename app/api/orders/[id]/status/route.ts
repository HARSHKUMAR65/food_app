import { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/api/responses";
import { updateOrderStatus } from "@/lib/services/order.service";
import { updateOrderStatusSchema } from "@/lib/validations/order.schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return jsonError("Order ID is required", 400);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body", 400);
  }

  const parsedBody = updateOrderStatusSchema.safeParse(body);

  if (!parsedBody.success) {
    return jsonError(
      "Invalid order status payload",
      400,
      parsedBody.error.flatten(),
    );
  }

  try {
    const order = await updateOrderStatus(id, parsedBody.data.status);

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk(order);
  } catch (error: unknown) {
    console.error("Failed to update order status", error);

    return jsonError("Failed to update order status", 500);
  }
}
