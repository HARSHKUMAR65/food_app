import { NextRequest, NextResponse } from "next/server";

import {
  createMenuItem,
  createMenuItems,
  getAvailableMenuItems,
} from "@/lib/services/menu.service";
import { createMenuItemRequestSchema } from "@/lib/validations/menu.schema";

export async function GET() {
  try {
    const menuItems = await getAvailableMenuItems();

    return NextResponse.json(menuItems, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to fetch menu items", error);

    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 },
    );
  }
}

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

  const parsedBody = createMenuItemRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid menu item payload",
        issues: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    if (parsedBody.data.type === "single") {
      const menuItem = await createMenuItem(parsedBody.data.item);

      return NextResponse.json(menuItem, { status: 201 });
    }

    const menuItems = await createMenuItems(parsedBody.data.items);

    return NextResponse.json(
      {
        count: menuItems.length,
        items: menuItems,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Failed to create menu item", error);

    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
  }
}
