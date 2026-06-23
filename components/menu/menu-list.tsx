import { MenuCard } from "@/components/menu/menu-card";
import type { MenuItem } from "@/types/food-order";

type MenuListProps = {
  items: MenuItem[];
};

export function MenuList({ items }: MenuListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        No menu items are available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}
