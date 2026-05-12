import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database/client";

export const auth = betterAuth({
  basePath: "/api/auth",
  
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: async (password: string) => {
        return await Bun.password.hash(password);
      },
      verify: async ({ password, hash }) => {
        return await Bun.password.verify(password, hash);
      },
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  trustedOrigins: [
    "http://localhost:5173", // Vite dev
    "http://localhost:3000", // NestJS API
  ],
});
