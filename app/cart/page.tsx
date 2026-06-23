"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <OrderFlowShell
      backHref="/"
      backLabel="Browse menu"
      description="Manage item quantities, review your order summary, and continue to delivery details."
      eyebrow="Step 1 of 3"
      title="Shopping cart"
    >
      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Cart items</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "items"} selected
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/">Add more</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            </CardContent>
          </Card>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </aside>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <ShoppingCart className="mb-4 size-14 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Add items from the menu before checkout. Your selected food will appear
              here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse Menu</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </OrderFlowShell>
  );
}
