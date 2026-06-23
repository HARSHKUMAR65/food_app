import { headers } from "next/headers";
import { MenuList } from "@/components/menu/menu-list";
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <header>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Food ordering</p>
          <h1 className="text-3xl font-bold tracking-tight">Menu</h1>
        </div>
      </header>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <MenuList items={menuItems} />
      )}
    </div>
  );
}
