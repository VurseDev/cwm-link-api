import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database/client";
import * as schema from "./database/schema";

export const auth = betterAuth({
  // Mantem as rotas de auth isoladas do restante do microservice.
  basePath: "/api/auth",

  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
    schema: schema,
  }),
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      // Bun.password fornece hash/verify nativos para o fluxo email/senha.
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
  
  trustedOrigins: ["*"], // Desenvolvimento local; restrinja em producao.
});
