import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// SQLite local simplifica o desenvolvimento sem depender de Postgres.
const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./auth.db";
const sqlite = new Database(dbPath, { create: true, readwrite: true, strict: true });

// Drizzle usa o schema tipado para criar queries compativeis com Better Auth.
export const db = drizzle(sqlite, { schema });
