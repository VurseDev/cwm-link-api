# Auth Service Testing Guide

## Environment Limitation

The auth service requires PostgreSQL to run. The current Claude Code environment does not have Docker or PostgreSQL available, so the service cannot be started and tested here.

## Testing on Your Local Machine

To test the auth service endpoints on your local machine, follow these steps:

### 1. Prerequisites

Ensure you have the following installed:
- **Bun** (v1.0+): `curl -fsSL https://bun.sh/install | bash`
- **Docker** & **Docker Compose**: For running PostgreSQL

### 2. Start PostgreSQL Database

From the repository root directory:

```bash
cd /workspace/claude-workspace/hhylpe_gmail.com/VurseDev/cwm-link-api
docker compose up -d auth-db
```

This starts PostgreSQL on port 5433 with:
- Database: `cwm_link_auth`
- User: `postgres`
- Password: `postgres`

Verify the database is running:
```bash
docker compose ps
```

### 3. Generate Database Migrations

Navigate to the auth-service directory and generate migrations:

```bash
cd auth-service
bun run db:generate
```

This creates migration files in the `drizzle/` directory based on your schema.

### 4. Run Database Migrations

Apply the migrations to create the database tables:

```bash
bun run db:migrate
```

This creates the following tables:
- `users` - User accounts
- `sessions` - Active sessions
- `accounts` - OAuth and password credentials
- `verifications` - Email verification tokens

### 5. Start the Auth Service

Start the development server:

```bash
bun run dev
```

You should see:
```
🚀 Auth Service running at http://localhost:3001
```

The service will auto-reload on file changes.

## Testing Endpoints

### 1. Health Check

Verify the service is running:

```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-12T10:30:00.000Z"
}
```

### 2. Service Info

Get service information:

```bash
curl http://localhost:3001/
```

**Expected Response:**
```json
{
  "message": "CWM Link Auth Service",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth/*"
  }
}
```

### 3. User Registration

Register a new user with email and password:

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

**Expected Response (Success):**
```json
{
  "user": {
    "id": "cm3x...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-05-12T10:30:00.000Z"
  },
  "session": {
    "id": "sess_...",
    "userId": "cm3x...",
    "expiresAt": "2026-05-19T10:30:00.000Z",
    "token": "..."
  }
}
```

**Expected Response (User Already Exists):**
```json
{
  "error": "User already exists"
}
```

### 4. User Login

Sign in with email and password:

```bash
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (Success):**
```json
{
  "user": {
    "id": "cm3x...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false,
    "image": null
  },
  "session": {
    "id": "sess_...",
    "userId": "cm3x...",
    "expiresAt": "2026-05-19T10:30:00.000Z",
    "token": "..."
  }
}
```

**Expected Response (Invalid Credentials):**
```json
{
  "error": "Invalid email or password"
}
```

### 5. Get Current Session

Retrieve the current user session (requires session cookie):

```bash
curl http://localhost:3001/api/auth/get-session \
  -H "Cookie: better-auth.session_token=<session-token>" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Expected Response (Authenticated):**
```json
{
  "user": {
    "id": "cm3x...",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": false,
    "image": null
  },
  "session": {
    "id": "sess_...",
    "userId": "cm3x...",
    "expiresAt": "2026-05-19T10:30:00.000Z"
  }
}
```

**Expected Response (Unauthenticated):**
```json
{
  "user": null,
  "session": null
}
```

### 6. Sign Out

Sign out the current user:

```bash
curl -X POST http://localhost:3001/api/auth/sign-out \
  -H "Cookie: better-auth.session_token=<session-token>" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "success": true
}
```

## Testing with Cookie Persistence

For proper session testing, use curl with cookie management:

### Register and Save Session
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "SecurePass123!",
    "name": "Test User 2"
  }' \
  --cookie-jar cookies.txt \
  -c cookies.txt
```

### Use Session for Subsequent Requests
```bash
curl http://localhost:3001/api/auth/get-session \
  --cookie cookies.txt
```

## Available Better Auth Endpoints

Better Auth provides many endpoints automatically. Here are the main ones:

### Authentication
- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out current session
- `GET /api/auth/get-session` - Get current session

### Email Verification
- `POST /api/auth/send-verification-email` - Send verification email
- `POST /api/auth/verify-email` - Verify email with token

### Password Management
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (requires auth)

### Account Management
- `POST /api/auth/update-user` - Update user profile
- `POST /api/auth/delete-user` - Delete user account
- `GET /api/auth/list-sessions` - List all user sessions

## Testing Error Cases

### Invalid Email Format
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "SecurePass123!",
    "name": "Test"
  }'
```

### Weak Password
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com",
    "password": "123",
    "name": "Test"
  }'
```

### Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test4@example.com"
  }'
```

## Frontend Integration

Once the auth service is tested and working, integrate it with your React frontend:

### Install Better Auth Client
```bash
cd client
npm install better-auth
```

### Create Auth Client
Create `client/src/api/auth.ts`:

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
  credentials: "include",
});

// Usage examples:
export const signUp = (email: string, password: string, name: string) =>
  authClient.signUp.email({
    email,
    password,
    name,
  });

export const signIn = (email: string, password: string) =>
  authClient.signIn.email({
    email,
    password,
  });

export const signOut = () => authClient.signOut();

export const getSession = () => authClient.getSession();
```

### Update Login Page
```typescript
import { signIn } from "../api/auth";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await signIn(email, password);
    if (result.user) {
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    }
  } catch (error) {
    toast.error("Invalid credentials");
  }
};
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker compose ps

# View database logs
docker compose logs auth-db

# Restart database
docker compose restart auth-db
```

### Auth Service Errors
```bash
# View auth service logs
cd auth-service
bun run dev

# Check environment variables
cat .env
```

### Migration Issues
```bash
# Reset migrations (WARNING: Deletes all data)
rm -rf drizzle/
bun run db:generate
bun run db:migrate
```

## Next Steps

1. ✅ Start PostgreSQL database
2. ✅ Generate and run migrations
3. ✅ Start auth service
4. ✅ Test all endpoints with curl
5. 🔄 Integrate with React frontend
6. 🔄 Test end-to-end authentication flow
7. 🔄 Deploy to production

## Production Deployment

For production deployment, ensure:
- Use strong `POSTGRES_PASSWORD` in environment variables
- Enable HTTPS/TLS for the auth service
- Configure proper CORS origins
- Set secure session cookie options
- Enable rate limiting for auth endpoints
- Set up monitoring and logging
- Configure backup strategy for auth database
