import { Clock, Flame, Star, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const summaryItems = [
  {
    icon: Star,
    label: "4.8 rating",
    value: "Fresh kitchen",
  },
  {
    icon: Clock,
    label: "25-35 min",
    value: "Average delivery",
  },
  {
    icon: Truck,
    label: "Free delivery",
    value: "Today",
  },
];

export function RestaurantSummary() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)]">
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Flame className="size-6" />
          </div>
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Open now</Badge>
              <Badge variant="outline">Chef curated</Badge>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Fresh meals from a fast modern kitchen
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Handpicked dishes, quick checkout, and live order status in one
                polished ordering flow.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border bg-background/70 p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <item.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
