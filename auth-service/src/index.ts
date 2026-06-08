import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { betterAuthPlugin } from "./http/plugins/better-auth";

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(
    // O front usa cookies de sessao do Better Auth, por isso credentials fica ativo.
    cors({
      origin: true,
      credentials: true,
    })
  )
  // Monta todas as rotas /api/auth/* gerenciadas pelo Better Auth.
  .use(betterAuthPlugin)
  .get("/", () => ({
    message: "CWM Link Auth Service",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
    },
  }))
  // Endpoint simples para validar se o microservice subiu.
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .listen(PORT);

console.log(
  `🚀 Auth Service running at http://${app.server?.hostname}:${app.server?.port}`
);
