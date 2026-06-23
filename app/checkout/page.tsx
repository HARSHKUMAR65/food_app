import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderFlowShell } from "@/components/layout/order-flow-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutPage() {
  return (
    <OrderFlowShell
      backHref="/cart"
      backLabel="Back to cart"
      description="Enter the delivery address and contact details for this order."
      eyebrow="Step 2 of 3"
      title="Delivery details"
    >
      <Card>
        <CardContent>
          <CheckoutForm />
        </CardContent>
      </Card>
    </OrderFlowShell>
  );
}
