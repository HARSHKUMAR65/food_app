import { PrismaPg } from "@prisma/adapter-pg";

import type { PrismaClient as GeneratedPrismaClient } from "@/app/generated/prisma/client";

type PrismaClient = GeneratedPrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prismaClient: PrismaClient | undefined;
let prismaClientPromise: Promise<PrismaClient> | undefined;

export async function getPrismaClient(): Promise<PrismaClient> {
  const cachedClient = globalForPrisma.prisma ?? prismaClient;

  if (cachedClient) {
    return cachedClient;
  }

  prismaClientPromise ??= createPrismaClient().catch((error: unknown) => {
    prismaClientPromise = undefined;
    throw error;
  });

  const client = await prismaClientPromise;
  prismaClient = client;

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

async function createPrismaClient(): Promise<PrismaClient> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const { PrismaClient } = await import("@/app/generated/prisma/client");

  return new PrismaClient({ adapter });
}
