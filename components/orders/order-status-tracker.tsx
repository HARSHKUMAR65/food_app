import { Badge } from "@/components/ui/badge";
import { orderStatusLabels } from "@/lib/constants/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/food-order";

type OrderStatusTrackerProps = {
  status: OrderStatus;
};

const statusBadgeClasses: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "bg-blue-600 text-white hover:bg-blue-600",
  PREPARING: "bg-yellow-400 text-yellow-950 hover:bg-yellow-400",
  OUT_FOR_DELIVERY: "bg-orange-500 text-white hover:bg-orange-500",
  DELIVERED: "bg-green-600 text-white hover:bg-green-600",
  CANCELLED: "bg-red-600 text-white hover:bg-red-600",
};

const statusMessages: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "We have received your order!",
  PREPARING: "Your food is being prepared...",
  OUT_FOR_DELIVERY: "Your order is on the way!",
  DELIVERED: "Delivered! Enjoy your meal 🎉",
  CANCELLED: "Your order was cancelled.",
};

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  return (
    <div className="space-y-3 text-center">
      <Badge
        className={cn("px-4 py-2 text-base font-semibold", statusBadgeClasses[status])}
        variant={status === "CANCELLED" ? "destructive" : "default"}
      >
        {orderStatusLabels[status]}
      </Badge>
      <p className="text-sm text-muted-foreground">{statusMessages[status]}</p>
    </div>
  );
}
