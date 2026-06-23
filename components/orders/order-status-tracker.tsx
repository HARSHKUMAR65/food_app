import { Badge } from "@/components/ui/badge";
import { orderStatusLabels } from "@/lib/constants/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/food-order";

type OrderStatusTrackerProps = {
  status: OrderStatus;
};

const statusMessages: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "We have received your order.",
  PREPARING: "Your food is being prepared.",
  OUT_FOR_DELIVERY: "Your order is on the way.",
  DELIVERED: "Delivered. Enjoy your meal.",
  CANCELLED: "Your order was cancelled.",
};

const activeOrderStatuses = [
  "ORDER_RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] satisfies readonly OrderStatus[];

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex =
    status === "CANCELLED" ? -1 : activeOrderStatuses.indexOf(status);

  return (
    <div className="space-y-5 text-center">
      <Badge
        className="px-4 py-2 text-sm"
        variant={
          status === "CANCELLED"
            ? "destructive"
            : status === "DELIVERED"
              ? "success"
              : "default"
        }
      >
        {orderStatusLabels[status]}
      </Badge>
      <p className="text-sm leading-6 text-muted-foreground">{statusMessages[status]}</p>

      {status !== "CANCELLED" ? (
        <div className="grid grid-cols-4 gap-2 text-left">
          {activeOrderStatuses.map((step, index) => {
            const isComplete = index <= currentIndex;

            return (
              <div key={step} className="space-y-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-colors",
                    isComplete ? "bg-primary" : "bg-muted",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-medium leading-5",
                    isComplete ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {orderStatusLabels[step]}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
