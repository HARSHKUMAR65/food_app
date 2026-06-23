import { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/api/responses";
import { createOrder, MenuItemUnavailableError } from "@/lib/services/order.service";
import { createOrderSchema } from "@/lib/validations/order.schema";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body", 400);
  }

  const parsedBody = createOrderSchema.safeParse(body);

  if (!parsedBody.success) {
    return jsonError("Invalid order payload", 400, parsedBody.error.flatten());
  }

  try {
    const order = await createOrder(parsedBody.data);

    return jsonOk(order, 201);
  } catch (error: unknown) {
    if (error instanceof MenuItemUnavailableError) {
      return jsonError(error.message, 400);
    }

    console.error("Failed to create order", error);

    return jsonError("Failed to create order", 500);
  }
}
