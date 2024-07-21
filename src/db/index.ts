import { PrismaClient } from "@prisma/client";

/**
 * The database client instance.
 * This instance is responsible for connecting to the database and executing queries.
 */
export const db = new PrismaClient();
