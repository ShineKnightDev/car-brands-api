import { setDefaultResultOrder } from "node:dns";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Some local networks/WSL setups cannot route IPv6 and fail with ENETUNREACH.
// Prefer IPv4 DNS results first to keep Supabase connectivity stable.
setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const isProduction = process.env.NODE_ENV === "production";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}