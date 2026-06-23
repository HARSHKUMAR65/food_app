"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ShoppingCart } from "lucide-react";
import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Textarea } from "@/components/ui/textarea";
import { readResponseError } from "@/lib/http";
import { useAuth } from "@/store/auth-context";
import type { Order } from "@/types/food-order";
import type { CreateOrderInput } from "@/types/order";

type CheckoutFormValues = Pick<
  CreateOrderInput,
  "customerName" | "customerPhone" | "customerAddress"
>;

export function CheckoutForm() {
  const router = useRouter();
  const { clearCart, items: cartItems } = useAuth();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (values) => {
    setSubmitError(null);

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const payload: CreateOrderInput = {
      customerName: values.customerName.trim(),
      customerPhone: values.customerPhone.trim(),
      customerAddress: values.customerAddress.trim(),
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSubmitError(await readResponseError(response, "Failed to place order"));
      return;
    }

    const order = (await response.json()) as Order;

    clearCart();
    router.push(`/orders/${order.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        action={
          <Button asChild>
            <Link href="/">Back to menu</Link>
          </Button>
        }
        description="Add at least one menu item before checkout."
        icon={ShoppingCart}
        title="Your cart is empty"
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
        <MapPin className="size-4" />
        <span>We will use these details to deliver your order.</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="customerName">
          Customer name
        </label>
        <Input
          id="customerName"
          placeholder="Jane Doe"
          {...register("customerName", {
            required: "Customer name is required",
            minLength: {
              value: 2,
              message: "Customer name must be at least 2 characters",
            },
          })}
        />
        {errors.customerName ? (
          <p className="text-sm text-destructive">{errors.customerName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="customerPhone">
          Phone
        </label>
        <Input
          id="customerPhone"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          {...register("customerPhone", {
            required: "Customer phone is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Customer phone must be exactly 10 digits",
            },
          })}
        />
        {errors.customerPhone ? (
          <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="customerAddress">
          Address
        </label>
        <Textarea
          id="customerAddress"
          placeholder="House number, street, city"
          {...register("customerAddress", {
            required: "Customer address is required",
            minLength: {
              value: 5,
              message: "Customer address must be at least 5 characters",
            },
          })}
        />
        {errors.customerAddress ? (
          <p className="text-sm text-destructive">{errors.customerAddress.message}</p>
        ) : null}
      </div>

      {submitError ? <Notice variant="error">{submitError}</Notice> : null}

      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
}
