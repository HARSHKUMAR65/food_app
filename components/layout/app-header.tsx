"use client";

import Link from "next/link";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-context";

export function AppHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 shadow-[0_1px_0_oklch(0.88_0.025_77)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 text-lg font-bold tracking-tight" href="/">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
          FoodApp
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost">
            <Link href="/">Menu</Link>
          </Button>
          <Button asChild className="relative" variant="outline">
            <Link aria-label={`Cart with ${itemCount} items`} href="/cart">
              <ShoppingCart />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 ? (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1.5 py-0 text-xs">
                  {itemCount}
                </Badge>
              ) : null}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
