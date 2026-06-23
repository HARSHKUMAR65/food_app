import { PageShell } from "@/components/layout/page-shell";
import { MenuList } from "@/components/menu/menu-list";
import { RestaurantSummary } from "@/components/menu/restaurant-summary";
import { Notice } from "@/components/ui/notice";
import { getAvailableMenuItems } from "@/lib/services/menu.service";
import type { MenuItem } from "@/types/food-order";
import type { MenuItemRecord } from "@/types/models";

export const dynamic = "force-dynamic";

async function getMenuItems(): Promise<MenuItem[]> {
  const menuItems = await getAvailableMenuItems();

  return menuItems.map(toMenuItem);
}

function toMenuItem(item: MenuItemRecord): MenuItem {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export default async function Home() {
  let menuItems: MenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    menuItems = await getMenuItems();
  } catch (error: unknown) {
    console.error("Failed to load menu page", error);
    errorMessage = "Menu unavailable. Please try again later.";
  }

  return (
    <PageShell
      description="Choose from chef-curated meals, add them to your cart, and track your delivery from kitchen to doorstep."
      eyebrow="Food delivery"
      title="Order fresh food"
    >
      <RestaurantSummary />

      {errorMessage ? (
        <Notice variant="error">{errorMessage}</Notice>
      ) : (
        <MenuList items={menuItems} />
      )}
    </PageShell>
  );
}
