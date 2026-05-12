import { Database } from "bun:sqlite";
import { readFileSync, readdirSync } from "fs";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./auth.db";
console.log(`Migrating database: ${dbPath}`);

const db = new Database(dbPath, { create: true });

// Find the latest migration SQL file
const migrationFiles = readdirSync("./drizzle").filter(f => f.endsWith(".sql")).sort();
const latestMigration = migrationFiles[migrationFiles.length - 1];
console.log(`Using migration file: ${latestMigration}`);

// Read the migration SQL file
const migrationSQL = readFileSync(`./drizzle/${latestMigration}`, "utf-8");

// Split by statement breakpoint and execute each statement
const statements = migrationSQL
  .split("--> statement-breakpoint")
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Executing ${statements.length} migration statements...`);

for (const statement of statements) {
  try {
    db.exec(statement);
    console.log(`✓ Executed: ${statement.substring(0, 50)}...`);
  } catch (error) {
    console.error(`✗ Failed to execute: ${statement.substring(0, 50)}...`);
    console.error(error);
  }
}

console.log("✓ Migration complete!");
db.close();
