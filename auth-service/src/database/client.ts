import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Use SQLite for local development/testing
// For production, switch back to PostgreSQL
const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./auth.db";
const sqlite = new Database(dbPath, { create: true, readwrite: true, strict: true });

export const db = drizzle(sqlite, { schema });
