import { jsonError, jsonOk } from "@/lib/api/responses";
import { getAvailableMenuItems } from "@/lib/services/menu.service";

export async function GET() {
  try {
    const menuItems = await getAvailableMenuItems();

    return jsonOk(menuItems);
  } catch (error: unknown) {
    console.error("Failed to fetch menu items", error);

    return jsonError("Failed to fetch menu items", 500);
  }
}
