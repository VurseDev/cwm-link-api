import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { betterAuthPlugin } from "./http/plugins/better-auth";

const PORT = process.env.PORT || 3001;

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    })
  )
  .use(betterAuthPlugin)
  .get("/", () => ({
    message: "CWM Link Auth Service",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
    },
  }))
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .listen(PORT);

console.log(
  `🚀 Auth Service running at http://${app.server?.hostname}:${app.server?.port}`
);
