"use client";

import Link from "next/link";
import { ReceiptText, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth-context";

type CartSummaryProps = {
  className?: string;
};

export function CartSummary({ className }: CartSummaryProps) {
  const { itemCount, totalAmount } = useAuth();
  const deliveryLabel = itemCount > 0 ? "Free" : formatCurrency(0);

  return (
    <Card className={cn("gap-5", className)}>
      <CardHeader className="space-y-2 pb-0">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="size-5 text-primary" />
            Order summary
          </CardTitle>
          {itemCount > 0 ? <Badge variant="secondary">{itemCount} items</Badge> : null}
        </div>
        <CardDescription>
          Review your total before moving to delivery details.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3">
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

        <div className="flex items-start gap-3 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
          <Truck className="mt-0.5 size-4 shrink-0" />
          <p>Free delivery is applied automatically for this ordering flow.</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3 pt-0">
        {itemCount > 0 ? (
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        ) : (
          <Button className="w-full" disabled size="lg" type="button">
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
