import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  return (
    <OrderFlowShell
      backHref="/cart"
      backLabel="Back to cart"
      description="Enter the delivery address and contact details for this order."
      eyebrow="Step 2 of 3"
      title="Delivery details"
    >
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Contact and address</CardTitle>
          <CardDescription>
            We will send updates to this phone number and deliver to this address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CheckoutForm />
        </CardContent>
      </Card>
    </OrderFlowShell>
  );
}
