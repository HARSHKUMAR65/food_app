import { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/api/responses";
import {
  createMenuItem,
  createMenuItems,
  getAvailableMenuItems,
} from "@/lib/services/menu.service";
import { createMenuItemRequestSchema } from "@/lib/validations/menu.schema";

export async function GET() {
  try {
    const menuItems = await getAvailableMenuItems();

    return jsonOk(menuItems);
  } catch (error: unknown) {
    console.error("Failed to fetch menu items", error);

    return jsonError("Failed to fetch menu items", 500);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON request body", 400);
  }

  const parsedBody = createMenuItemRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return jsonError("Invalid menu item payload", 400, parsedBody.error.flatten());
  }

  try {
    if (parsedBody.data.type === "single") {
      const menuItem = await createMenuItem(parsedBody.data.item);

      return jsonOk(menuItem, 201);
    }

    const menuItems = await createMenuItems(parsedBody.data.items);

    return jsonOk(
      {
        count: menuItems.length,
        items: menuItems,
      },
      201,
    );
  } catch (error: unknown) {
    console.error("Failed to create menu item", error);

    return jsonError("Failed to create menu item", 500);
  }
}
