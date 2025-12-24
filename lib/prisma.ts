import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const db =
  process.env.NODE_ENV === "production"
    ? new PrismaClient({ adapter })
    : (globalThis.prisma ?? (globalThis.prisma = new PrismaClient({ adapter })));
export { db };


