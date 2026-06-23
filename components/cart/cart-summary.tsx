"use client";

import Link from "next/link";
import { Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type CartSummaryProps = {
  className?: string;
};

export function CartSummary({ className }: CartSummaryProps) {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const totalAmount = useCartStore((state) => state.getTotalAmount());
  const deliveryLabel = itemCount > 0 ? "Free" : formatCurrency(0);

  return (
    <Card className={cn("gap-5", className)}>
      <CardHeader className="space-y-2 pb-0">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Order summary</CardTitle>
          {itemCount > 0 ? <Badge variant="secondary">{itemCount} items</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Review your total before moving to delivery details.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="promo-code">
            Promo code
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                id="promo-code"
                placeholder="FOOD10"
                type="text"
              />
            </div>
            <Button type="button" variant="outline">
              Apply
            </Button>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>{deliveryLabel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Taxes</span>
            <span>Included</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          Delivery is free for this demo order flow. Taxes are included in menu prices.
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3 pt-0">
        {itemCount > 0 ? (
          <Button asChild className="h-11 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        ) : (
          <Button className="h-11 w-full" disabled type="button">
            Proceed to Checkout
          </Button>
        )}
        <Button asChild className="w-full" variant="ghost">
          <Link href="/">Continue shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
