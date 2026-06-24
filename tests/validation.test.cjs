/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../lib/validations/order.schema.ts");

test("order payload rejects invalid phone and oversized quantities", () => {
  const parsed = createOrderSchema.safeParse({
    customerName: "A",
    customerPhone: "123",
    customerAddress: "Road",
    items: [
      {
        menuItemId: "demo-truffle-pizza",
        quantity: 99,
      },
    ],
  });

  assert.equal(parsed.success, false);
  const flattened = parsed.error.flatten();
  assert.ok(flattened.fieldErrors.customerName);
  assert.ok(flattened.fieldErrors.customerPhone);
  assert.ok(flattened.fieldErrors.customerAddress);
  assert.ok(flattened.fieldErrors.items);
});

test("status payload allows only known order statuses", () => {
  assert.equal(
    updateOrderStatusSchema.safeParse({ status: "OUT_FOR_DELIVERY" }).success,
    true,
  );
  assert.equal(updateOrderStatusSchema.safeParse({ status: "UNKNOWN" }).success, false);
});
