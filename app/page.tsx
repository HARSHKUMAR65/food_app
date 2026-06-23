import { headers } from "next/headers";
import { PageShell } from "@/components/layout/page-shell";
import { MenuList } from "@/components/menu/menu-list";
import { RestaurantSummary } from "@/components/menu/restaurant-summary";
import { Notice } from "@/components/ui/notice";
import type { MenuItem } from "@/types/food-order";

export const dynamic = "force-dynamic";

async function getMenuItems(): Promise<MenuItem[]> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    throw new Error("Unable to determine request host");
  }
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const response = await fetch(`${protocol}://${host}/api/menu`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch menu");
  }

  return (await response.json()) as MenuItem[];
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
