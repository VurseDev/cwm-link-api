# CWM Link Auth Service

Better Auth microservice for CWM Link Parts Management System.

## Stack

- **Elysia.js** - Fast web framework
- **Better Auth** - Modern authentication
- **Drizzle ORM** - Type-safe database access
- **PostgreSQL** - Database
- **Bun** - Runtime

## Features

- ✅ Email/Password authentication
- ✅ Session management (7-day expiry)
- ✅ Cookie-based sessions
- ✅ Secure password hashing with Bun
- ✅ CORS enabled for frontend
- ✅ Auto sign-in after registration

## Quick Start

### 1. Install dependencies

```bash
cd auth-service
bun install
```

### 2. Setup environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL
```

### 3. Generate and run migrations

```bash
bun run db:generate
bun run db:migrate
```

### 4. Start dev server

```bash
bun run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Authentication (Better Auth)
All auth endpoints are under `/api/auth`:

- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Login with email/password
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/get-session` - Get session data

## Frontend Integration

```typescript
// In your React app
const response = await fetch('http://localhost:3001/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});
```

## Database Schema

- **users** - User accounts
- **sessions** - Active sessions
- **accounts** - Auth provider accounts
- **verifications** - Email/phone verification

## Development

```bash
# Watch mode
bun run dev

# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate
```

## Docker

```bash
# Build and run with docker-compose
docker-compose up auth-service
```
