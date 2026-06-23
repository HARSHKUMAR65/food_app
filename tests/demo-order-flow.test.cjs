/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");

const { getDemoMenuItems } = require("../lib/data/demo-menu.ts");
const {
  createDemoOrder,
  getDemoOrderById,
  updateDemoOrderStatus,
} = require("../lib/data/demo-orders.ts");
const { formatCurrency } = require("../lib/formatters.ts");

test("demo order flow calculates totals from menu prices", () => {
  const [menuItem] = getDemoMenuItems();
  const order = createDemoOrder({
    customerName: "Jane Doe",
    customerPhone: "9876543210",
    customerAddress: "12 Market Street",
    items: [
      {
        menuItemId: menuItem.id,
        quantity: 2,
      },
    ],
  });

  assert.equal(order.items.length, 1);
  assert.equal(order.items[0].menuItem.id, menuItem.id);
  assert.equal(order.totalAmount, menuItem.price * 2);
  assert.equal(getDemoOrderById(order.id).id, order.id);
});

test("demo order status can be updated and preserves order items", () => {
  const [menuItem] = getDemoMenuItems();
  const order = createDemoOrder({
    customerName: "Sam Kitchen",
    customerPhone: "9123456789",
    customerAddress: "44 Food Lane",
    items: [
      {
        menuItemId: menuItem.id,
        quantity: 1,
      },
    ],
  });

  const updatedOrder = updateDemoOrderStatus(order.id, "OUT_FOR_DELIVERY");

  assert.equal(updatedOrder.status, "OUT_FOR_DELIVERY");
  assert.equal(updatedOrder.items.length, 1);
  assert.equal(updatedOrder.items[0].menuItemId, menuItem.id);
});

test("currency formatter uses Indian rupee formatting without decimals", () => {
  assert.equal(formatCurrency(449), "₹449");
});
