import { jsonError, jsonOk } from "@/lib/api/responses";
import { getOrderById } from "@/lib/services/order.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return jsonError("Order ID is required", 400);
  }

  try {
    const order = await getOrderById(id);

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return jsonOk(order);
  } catch (error: unknown) {
    console.error("Failed to fetch order", error);

    return jsonError("Failed to fetch order", 500);
  }
}
