/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const test = require("node:test");

const { GET: getOrder } = require("../app/api/orders/[id]/route.ts");
const { POST: postOrder } = require("../app/api/orders/route.ts");
const { PATCH: patchStatus } = require("../app/api/orders/[id]/status/route.ts");

async function readJson(response) {
  return response.json();
}

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
