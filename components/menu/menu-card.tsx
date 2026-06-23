"use client";

import { Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/store/auth-context";
import type { MenuItem } from "@/types/food-order";

type MenuCardProps = {
  item: MenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const { addItem, items } = useAuth();
  const quantityInCart =
    items.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0;

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          fill
          unoptimized
          alt={item.name}
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={item.image}
        />
        <div className="absolute left-3 top-3">
          <Badge variant={quantityInCart > 0 ? "success" : "secondary"}>
            {quantityInCart > 0 ? `${quantityInCart} in cart` : "Available"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
            {item.name}
          </h3>
          <p className="line-clamp-2 min-h-11 text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Price
            </p>
            <p className="text-2xl font-bold">{formatCurrency(item.price)}</p>
          </div>
          <Button
            aria-label={`Add ${item.name} to cart`}
            type="button"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
              })
            }
          >
            {quantityInCart > 0 ? <Plus /> : <ShoppingCart />}
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
