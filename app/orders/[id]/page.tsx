"use client";

import { useParams } from "next/navigation";
import * as React from "react";

import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { OrderStatusTracker } from "@/components/orders/order-status-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { Order } from "@/types/food-order";

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

async function readResponseError(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();
    return getErrorMessage(payload, "Failed to load order");
  } catch {
    return "Failed to load order";
  }
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      if (!orderId) {
        setError("Order ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(await readResponseError(response));
        }

        const nextOrder = (await response.json()) as Order;

        if (isMounted) {
          setOrder(nextOrder);
          setError(null);
        }
      } catch (fetchError: unknown) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load order");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchOrder();

    const intervalId = window.setInterval(() => {
      void fetchOrder();
    }, 3_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [orderId]);

  return (
    <OrderFlowShell
      backHref="/"
      backLabel="Back to menu"
      description="Track the current status of your order here. This page updates automatically."
      eyebrow="Step 3 of 3"
      title="Order success"
    >
      {isLoading ? <p className="text-muted-foreground">Loading order...</p> : null}

      {error ? (
        <div className="w-full rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {order ? (
        <div className="grid w-full gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">Order confirmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <OrderStatusTracker status={order.status} />
              <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="max-w-44 truncate font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="border-t pt-2">
                  <p className="text-muted-foreground">Delivery address</p>
                  <p className="mt-1 font-medium text-foreground">{order.customerAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-left">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.menuItem.name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </OrderFlowShell>
  );
}
