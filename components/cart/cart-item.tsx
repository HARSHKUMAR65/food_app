"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { useCartStore } from "@/store/cart-store";
import type { CartItem as CartStoreItem } from "@/types/cart";

type CartItemProps = {
  item: CartStoreItem;
};

export function CartItem({ item }: CartItemProps) {
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[128px_1fr_auto]">
      <div className="relative h-36 w-full overflow-hidden rounded-lg bg-muted sm:h-32">
        <Image
          fill
          unoptimized
          alt={item.name}
          className="object-cover"
          sizes="(min-width: 768px) 672px, 100vw"
          src={item.image}
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="space-y-1">
          <h2 className="truncate text-base font-semibold">{item.name}</h2>
          <p className="text-sm text-muted-foreground">Freshly prepared food item</p>
          <p className="text-sm font-medium">{formatCurrency(item.price)} each</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            aria-label={`Decrease ${item.name} quantity`}
            className="size-8"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => decreaseQuantity(item.id)}
          >
            <Minus />
          </Button>
          <span className="min-w-10 rounded-md border bg-background px-3 py-1 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            aria-label={`Increase ${item.name} quantity`}
            className="size-8"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => increaseQuantity(item.id)}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <p className="text-lg font-semibold">{formatCurrency(item.price * item.quantity)}</p>
        <Button
          aria-label={`Remove ${item.name} from cart`}
          className="text-muted-foreground hover:text-destructive"
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 />
          <span className="sm:sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}
