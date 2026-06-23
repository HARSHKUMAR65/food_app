/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createMenuItemRequestSchema,
} = require("../lib/validations/menu.schema.ts");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../lib/validations/order.schema.ts");

test("menu payload accepts bulk wrapper and defaults availability", () => {
  const parsed = createMenuItemRequestSchema.safeParse({
    items: [
      {
        name: "Paneer Bowl",
        description: "Paneer, rice, and salad",
        price: 299,
        image: "https://example.com/paneer.jpg",
      },
    ],
  });

  assert.equal(parsed.success, true);
  assert.equal(parsed.data.type, "bulk");
  assert.equal(parsed.data.items[0].isAvailable, true);
});

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
