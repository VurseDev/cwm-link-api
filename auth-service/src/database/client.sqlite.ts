import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const dbUrl = process.env.DATABASE_URL?.replace("file:", "") || "./auth.db";
const sqlite = new Database(dbUrl);
export const db = drizzle(sqlite);
