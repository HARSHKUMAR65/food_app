"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { useCartStore } from "@/store/cart-store";
import type { MenuItem } from "@/types/food-order";

type MenuCardProps = {
  item: MenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const quantityInCart = useCartStore(
    (state) => state.items.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0,
  );

  return (
    <Card className="h-[440px] overflow-hidden py-0">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
        <Image
          fill
          unoptimized
          alt={item.name}
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={item.image}
        />
      </div>
      <CardHeader className="pb-0">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-lg">{item.name}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-4">
        <div className="space-y-2">
          <p className="text-2xl font-bold">{formatCurrency(item.price)}</p>
          <Badge variant="secondary">
            {quantityInCart > 0 ? `${quantityInCart} in cart` : "Available"}
          </Badge>
        </div>
        <Button
          className="mt-auto w-full mb-6"
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
          <ShoppingCart />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
