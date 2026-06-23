import { PrismaPg } from "@prisma/adapter-pg";

import type { MenuItemRecord, OrderWithItems } from "@/types/models";

type MenuItemCreateArgs = {
  data: {
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
  };
};

type PrismaTransactionClient = {
  menuItem: {
    create: (args: MenuItemCreateArgs) => Promise<MenuItemRecord>;
    findMany: (args: unknown) => Promise<MenuItemRecord[]>;
  };
  order: {
    create: (args: unknown) => Promise<OrderWithItems>;
  };
};

export type PrismaClientLike = {
  menuItem: {
    create: (args: MenuItemCreateArgs) => Promise<MenuItemRecord>;
    findMany: (args: unknown) => Promise<MenuItemRecord[]>;
  };
  order: {
    findUnique: (args: unknown) => Promise<OrderWithItems | null>;
    update: (args: unknown) => Promise<OrderWithItems>;
  };
  $transaction: <T>(
    operation: (tx: PrismaTransactionClient) => Promise<T>,
  ) => Promise<T>;
};

type PrismaClientConstructor = new (options: {
  adapter: PrismaPg;
}) => PrismaClientLike;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
};

export async function getPrismaClient(): Promise<PrismaClientLike> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prismaModule = (await import("@prisma/client")) as unknown as {
    PrismaClient?: PrismaClientConstructor;
  };

  if (!prismaModule.PrismaClient) {
    throw new Error("PrismaClient is not available from @prisma/client");
  }

  const { PrismaClient } = prismaModule;
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
