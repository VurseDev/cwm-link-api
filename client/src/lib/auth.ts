import { createAuthClient } from "better-auth/react";

// URL do microservice de autenticacao; em producao vem do ambiente do build.
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
});

// Exports usados pelas telas de login, cadastro e rotas protegidas.
export const { signIn, signUp, signOut, useSession } = authClient;
