import { NextRequest, NextResponse } from "next/server";

import { createOrder, MenuItemUnavailableError } from "@/lib/services/order.service";
import { createOrderSchema } from "@/lib/validations/order.schema";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const parsedBody = createOrderSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid order payload",
        issues: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(parsedBody.data);

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof MenuItemUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to create order", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
