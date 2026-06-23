import { NextResponse } from "next/server";

import { getOrderById } from "@/lib/services/order.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to fetch order", error);

    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
