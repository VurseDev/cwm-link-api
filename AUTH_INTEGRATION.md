# CWM Link - Better Auth Integration

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│   Vite + React  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌────────────────┐  ┌──────────────┐
│  Auth Service  │  │  NestJS API  │
│  (Port 3001)   │  │  (Port 3000) │
│                │  │              │
│ Better Auth    │  │ Parts CRUD   │
│ + Elysia.js    │  │ Workers CRUD │
└───────┬────────┘  └──────────────┘
        │
        ▼
┌────────────────┐
│   PostgreSQL   │
│  (Port 5433)   │
│                │
│  Auth Database │
└────────────────┘
```

## Services

### 1. Auth Service (NEW)
- **Port**: 3001
- **Framework**: Elysia.js + Better Auth
- **Database**: PostgreSQL (separate from main API)
- **Purpose**: Handle all authentication

### 2. NestJS API (EXISTING)
- **Port**: 3000
- **Framework**: NestJS
- **Purpose**: Parts, Workers, Business Logic
- **No Changes Needed**: Keep existing JWT auth for now

### 3. React Frontend
- **Port**: 5173
- **Talks to**: Both services
  - Auth Service for login/register/sessions
  - NestJS API for parts/workers data

## Getting Started

### Step 1: Start Auth Database

```bash
docker-compose up auth-db -d
```

### Step 2: Setup Auth Service

```bash
cd auth-service
bun install
bun run db:generate
bun run db:migrate
bun run dev
```

### Step 3: Verify Auth Service

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-12T10:00:00.000Z"
}
```

### Step 4: Test Registration

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## Frontend Integration

### Update API Client

Create new auth client:

```typescript
// client/src/api/auth.ts
const AUTH_URL = 'http://localhost:3001/api/auth';

export const betterAuthApi = {
  signUp: async (data: { email: string; password: string; name?: string }) => {
    const response = await fetch(`${AUTH_URL}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies!
      body: JSON.stringify(data),
    });
    return response.json();
  },

  signIn: async (data: { email: string; password: string }) => {
    const response = await fetch(`${AUTH_URL}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  signOut: async () => {
    const response = await fetch(`${AUTH_URL}/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  getSession: async () => {
    const response = await fetch(`${AUTH_URL}/get-session`, {
      credentials: 'include',
    });
    return response.json();
  },
};
```

### Update Login/Register Pages

```typescript
// In Login.tsx
import { betterAuthApi } from '@/api/auth';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await betterAuthApi.signIn({ email, password });
    if (response.user) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  } catch (error) {
    toast.error('Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

## Migration Strategy

### Phase 1: Parallel Auth (Current)
- ✅ Auth Service handles new registrations
- ⏸️ NestJS API keeps existing JWT auth
- 📊 Frontend uses Auth Service for login/register

### Phase 2: Migrate Existing Users (Future)
- Export users from NestJS database
- Import into Better Auth database
- Rehash passwords with Bun

### Phase 3: Deprecate Old Auth (Future)
- Remove JWT auth from NestJS
- All auth through Better Auth
- NestJS becomes pure business logic API

## Benefits

✅ **Better Security**: Modern auth with Better Auth
✅ **Session Management**: Proper cookie-based sessions
✅ **Microservices**: Independent scaling
✅ **Clean Separation**: Auth logic separate from business logic
✅ **Easy Maintenance**: Based on proven angelwings setup

## Next Steps

1. ✅ Auth service created
2. ⏭️ Test auth endpoints
3. ⏭️ Update React frontend to use Better Auth
4. ⏭️ Add session validation to NestJS API
5. ⏭️ Deploy both services

## Environment Variables

### Auth Service (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/cwm_link_auth
PORT=3001
```

### NestJS API (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cwm_link
AUTH_SERVICE_URL=http://localhost:3001
```

### React Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3001/api/auth
```
