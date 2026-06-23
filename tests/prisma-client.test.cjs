/* eslint-disable @typescript-eslint/no-require-imports */

require("./setup.cjs");

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("app uses the configured generated Prisma client output", () => {
  const rootDir = path.resolve(__dirname, "..");
  const generatedClientPath = path.join(rootDir, "app/generated/prisma/client.ts");
  const prismaSource = fs.readFileSync(path.join(rootDir, "lib/prisma.ts"), "utf8");
  const generatedClientSource = fs.readFileSync(generatedClientPath, "utf8");

  assert.ok(fs.existsSync(generatedClientPath));
  assert.match(prismaSource, /@\/app\/generated\/prisma\/client/);
  assert.doesNotMatch(prismaSource, /import\("@prisma\/client"\)/);
  assert.match(generatedClientSource, /export const PrismaClient/);
});
