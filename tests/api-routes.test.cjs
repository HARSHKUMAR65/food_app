/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");
const assert = require("node:assert/strict");
const test = require("node:test");
const { GET: getMenu } = require("../app/api/menu/route.ts");
const { GET: getOrder } = require("../app/api/orders/[id]/route.ts");
const { POST: postOrder } = require("../app/api/orders/route.ts");
const { PATCH: patchStatus } = require("../app/api/orders/[id]/status/route.ts");
const { getDemoMenuItems } = require("../lib/data/demo-menu.ts");
const { getDemoOrderById } = require("../lib/data/demo-orders.ts");

async function readJson(response) {
  return response.json();
}

async function createRouteOrder(quantity = 2) {
  const [menuItem] = getDemoMenuItems();
  const response = await postOrder(
    new Request("http://localhost/api/orders", {
      body: JSON.stringify({
        customerName: "Route Tester",
        customerPhone: "9876543210",
        customerAddress: "12 Test Street",
        items: [
          {
            menuItemId: menuItem.id,
            quantity,
          },
        ],
      }),
      method: "POST",
    }),
  );
  const payload = await readJson(response);

  return {
    menuItem,
    payload,
    response,
  };
}

test("menu route returns available menu items", async () => {
  const response = await getMenu();
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(payload));
  assert.ok(payload.length > 0);
  assert.ok(payload.every((item) => item.isAvailable === true));
});

test("order creation route creates an order and computes totals from item prices", async () => {
  const { menuItem, payload, response } = await createRouteOrder(3);

  assert.equal(response.status, 201);
  assert.equal(payload.customerName, "Route Tester");
  assert.equal(payload.status, "ORDER_RECEIVED");
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0].menuItemId, menuItem.id);
  assert.equal(payload.items[0].price, menuItem.price);
  assert.equal(payload.totalAmount, menuItem.price * 3);
});

test("order lookup route returns a persisted order", async () => {
  const { payload: createdOrder } = await createRouteOrder(1);
  const response = await getOrder(
    new Request(`http://localhost/api/orders/${createdOrder.id}`),
    {
      params: Promise.resolve({ id: createdOrder.id }),
    },
  );
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.id, createdOrder.id);
  assert.equal(payload.items.length, 1);
});

test("order lookup route resolves elapsed status without background timers", async () => {
  const { payload: createdOrder } = await createRouteOrder(1);
  const storedOrder = getDemoOrderById(createdOrder.id);
  assert.ok(storedOrder);
  storedOrder.createdAt = new Date(Date.now() - 31_000);

  const response = await getOrder(
    new Request(`http://localhost/api/orders/${createdOrder.id}`),
    {
      params: Promise.resolve({ id: createdOrder.id }),
    },
  );
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.status, "DELIVERED");
});

test("order lookup route returns 404 for a missing order", async () => {
  const response = await getOrder(
    new Request("http://localhost/api/orders/missing-order"),
    {
      params: Promise.resolve({ id: "missing-order" }),
    },
  );
  const payload = await readJson(response);

  assert.equal(response.status, 404);
  assert.deepEqual(payload, { error: "Order not found" });
});

test("status update route updates and returns the order", async () => {
  const { payload: createdOrder } = await createRouteOrder(1);
  const response = await patchStatus(
    new Request(`http://localhost/api/orders/${createdOrder.id}/status`, {
      body: JSON.stringify({ status: "OUT_FOR_DELIVERY" }),
      method: "PATCH",
    }),
    {
      params: Promise.resolve({ id: createdOrder.id }),
    },
  );
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.id, createdOrder.id);
  assert.equal(payload.status, "OUT_FOR_DELIVERY");

  const persistedResponse = await getOrder(
    new Request(`http://localhost/api/orders/${createdOrder.id}`),
    {
      params: Promise.resolve({ id: createdOrder.id }),
    },
  );
  const persistedPayload = await readJson(persistedResponse);

  assert.equal(persistedPayload.status, "OUT_FOR_DELIVERY");
});

test("order creation route returns a consistent error for invalid JSON", async () => {
  const response = await postOrder(
    new Request("http://localhost/api/orders", {
      body: "{not-json",
      method: "POST",
    }),
  );
  const payload = await readJson(response);

  assert.equal(response.status, 400);
  assert.deepEqual(payload, { error: "Invalid JSON request body" });
});

test("order creation route returns validation issues for bad payloads", async () => {
  const response = await postOrder(
    new Request("http://localhost/api/orders", {
      body: JSON.stringify({
        customerName: "",
        customerPhone: "123",
        customerAddress: "",
        items: [],
      }),
      method: "POST",
    }),
  );
  const payload = await readJson(response);
  assert.equal(response.status, 400);
  assert.equal(payload.error, "Invalid order payload");
  assert.ok(payload.issues.fieldErrors.customerName);
  assert.ok(payload.issues.fieldErrors.customerPhone);
  assert.ok(payload.issues.fieldErrors.customerAddress);
  assert.ok(payload.issues.fieldErrors.items);
});

test("order lookup route validates the route id", async () => {
  const response = await getOrder(new Request("http://localhost/api/orders/"), {
    params: Promise.resolve({ id: "" }),
  });
  const payload = await readJson(response);

  assert.equal(response.status, 400);
  assert.deepEqual(payload, { error: "Order ID is required" });
});

test("status update route returns validation issues for bad statuses", async () => {
  const response = await patchStatus(
    new Request("http://localhost/api/orders/demo/status", {
      body: JSON.stringify({ status: "COOKING" }),
      method: "PATCH",
    }),
    {
      params: Promise.resolve({ id: "demo-order" }),
    },
  );
  const payload = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(payload.error, "Invalid order status payload");
  assert.ok(payload.issues.fieldErrors.status);
});
