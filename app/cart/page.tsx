"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/store/auth-context";

export default function CartPage() {
  const { itemCount, items } = useAuth();

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
                <CardDescription>
                  {itemCount} {itemCount === 1 ? "item" : "items"} selected
                </CardDescription>
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
        <EmptyState
          action={
            <Button asChild>
              <Link href="/">Browse Menu</Link>
            </Button>
          }
          description="Add items from the menu before checkout. Your selected food will appear here."
          icon={ShoppingCart}
          title="Your cart is empty"
        />
      )}
    </OrderFlowShell>
  );
}
