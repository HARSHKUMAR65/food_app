import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const parsedBody = updateOrderStatusSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid order status payload",
        issues: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const order = await updateOrderStatus(id, parsedBody.data.status);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to update order status", error);

    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
