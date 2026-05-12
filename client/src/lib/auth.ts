import { createAuthClient } from "better-auth/react";

// Auth service URL - update for production
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
});

// Export auth methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
