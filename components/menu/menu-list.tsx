import { Utensils } from "lucide-react";

import { MenuCard } from "@/components/menu/menu-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { MenuItem } from "@/types/food-order";

type MenuListProps = {
  items: MenuItem[];
};

export function MenuList({ items }: MenuListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        description="The kitchen has no available dishes right now. Please check back shortly."
        icon={Utensils}
        title="No menu items available"
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Popular dishes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fresh picks from today&apos;s kitchen.
          </p>
        </div>
        <p className="hidden text-sm font-medium text-muted-foreground sm:block">
          {items.length} dishes
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
      </div>
    </section>
  );
}
