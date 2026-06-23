"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function AppHeader() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="text-xl font-bold tracking-tight" href="/">
          FoodApp
        </Link>
        <Button asChild className="relative" size="icon" variant="ghost">
          <Link aria-label={`Cart with ${itemCount} items`} href="/cart">
            <ShoppingCart />
            {itemCount > 0 ? (
              <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 text-xs">
                {itemCount}
              </Badge>
            ) : null}
          </Link>
        </Button>
      </div>
    </header>
  );
}
