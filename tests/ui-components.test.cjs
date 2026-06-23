/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const {
  OrderStatusTracker,
} = require("../components/orders/order-status-tracker.tsx");

test("OrderStatusTracker renders the active status and step labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(OrderStatusTracker, { status: "OUT_FOR_DELIVERY" }),
  );

  assert.match(markup, /Out for delivery/);
  assert.match(markup, /Your order is on the way/);
  assert.match(markup, /Order received/);
  assert.match(markup, /Preparing/);
  assert.match(markup, /Delivered/);
});

test("OrderStatusTracker renders cancelled state without the active stepper", () => {
  const markup = renderToStaticMarkup(
    React.createElement(OrderStatusTracker, { status: "CANCELLED" }),
  );

  assert.match(markup, /Cancelled/);
  assert.match(markup, /Your order was cancelled/);
  assert.doesNotMatch(markup, /Out for delivery/);
});
