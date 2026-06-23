"use client";

import { useParams } from "next/navigation";
import * as React from "react";

import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { OrderStatusTracker } from "@/components/orders/order-status-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { formatCurrency } from "@/lib/formatters";
import { readResponseError } from "@/lib/http";
import type { Order } from "@/types/food-order";

const terminalOrderStatuses = new Set<Order["status"]>(["DELIVERED", "CANCELLED"]);
const maxConsecutiveFetchErrors = 5;

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    let shouldPoll = true;
    let consecutiveFetchErrors = 0;
    const intervalId = window.setInterval(() => {
      if (shouldPoll) {
        void fetchOrder();
      }
    }, 3_000);

    function stopPolling() {
      shouldPoll = false;
      window.clearInterval(intervalId);
    }

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
          throw new Error(await readResponseError(response, "Failed to load order"));
        }

        const nextOrder = (await response.json()) as Order;

        if (isMounted) {
          setOrder(nextOrder);
          setError(null);
          consecutiveFetchErrors = 0;
        }

        if (terminalOrderStatuses.has(nextOrder.status)) {
          stopPolling();
        }
      } catch (fetchError: unknown) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load order");
        }

        consecutiveFetchErrors += 1;

        if (consecutiveFetchErrors >= maxConsecutiveFetchErrors) {
          stopPolling();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchOrder();

    return () => {
      isMounted = false;
      stopPolling();
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
      {isLoading ? (
        <Notice className="mx-auto w-full max-w-2xl">Loading order details...</Notice>
      ) : null}

      {error ? (
        <Notice className="mx-auto w-full max-w-2xl" variant="error">
          {error}
        </Notice>
      ) : null}

      {order ? (
        <div className="mx-auto grid w-full max-w-3xl gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Order confirmed</CardTitle>
              <CardDescription>
                We are updating this page automatically while the order is active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <OrderStatusTracker status={order.status} />
              <div className="space-y-3 rounded-lg border bg-background/70 p-4 text-left text-sm">
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
              <CardDescription>Final bill for this order.</CardDescription>
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
