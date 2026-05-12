# 🚀 How to Start All Services

This guide shows you how to run all three services locally for development.

---

## 📋 Services Overview

1. **Auth Service** (Port 3000) - Better Auth microservice
2. **NestJS API** (Port 3001) - Business logic API
3. **React Frontend** (Port 5173) - Vite dev server

---

## 🔧 Prerequisites

Install required runtimes:
- **Node.js** (v18+): https://nodejs.org/
- **Bun** (latest): `curl -fsSL https://bun.sh/install | bash`

---

## 🚀 Starting Services (3 Terminals)

### Terminal 1: Auth Service

```bash
cd auth-service
bun install                    # First time only
bun run migrate.ts             # First time only (creates database)
bun run dev
```

**Expected output:**
```
🚀 Auth Service running at http://localhost:3000
```

**Test it:**
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

### Terminal 2: NestJS API

```bash
# From project root
npm install                    # First time only
npm run build                  # First time only
npm start
```

**Expected output:**
```
🚀 NestJS API running at http://localhost:3001
```

**Test it:**
```bash
curl http://localhost:3001/parts
# Should return: [] (empty array)
```

---

### Terminal 3: React Frontend

```bash
cd client
npm install --legacy-peer-deps # First time only
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open in browser:**
http://localhost:5173

---

## ✅ Verify Everything Works

### 1. Check All Services Running

Open browser console (F12) and visit http://localhost:5173

You should see:
- ✅ No CORS errors in console
- ✅ Frontend loads without errors

### 2. Test Registration

1. Click **"Sign up"**
2. Enter email: `test@test.com`
3. Enter password: `Test123`
4. Enter name: `Test User`
5. Click **"Sign up"**

**Expected:**
- ✅ Success toast appears
- ✅ Redirects to dashboard
- ✅ Shows user name in header

### 3. Test Sign Out

1. Click user dropdown in dashboard
2. Click **"Sign Out"**

**Expected:**
- ✅ Success toast appears
- ✅ Redirects to login page

### 4. Test Login

1. Enter email: `test@test.com`
2. Enter password: `Test123`
3. Click **"Sign in"**

**Expected:**
- ✅ Success toast appears
- ✅ Redirects to dashboard

---

## 🐛 Troubleshooting

### "Failed to fetch" errors

**Problem:** Frontend can't connect to backend services

**Solutions:**

1. **Check services are running:**
   ```bash
   # Check ports
   lsof -i :3000  # Auth service
   lsof -i :3001  # NestJS API
   lsof -i :5173  # Frontend
   ```

2. **Check browser console** (F12):
   - Look for CORS errors
   - Look for network errors in Network tab

3. **Check environment variables:**
   ```bash
   # In client/.env
   cat client/.env
   # Should show:
   # VITE_AUTH_URL=http://localhost:3000
   # VITE_API_URL=http://localhost:3001
   ```

4. **Restart all services**

### CORS Errors

**Problem:** Browser shows CORS policy errors

**Solution:**
- Already fixed in code (origin: true for dev)
- Make sure you pulled latest changes
- Restart auth service and NestJS API

### Auth Service Won't Start

**Problem:** Bun errors or database errors

**Solutions:**

1. **Database file permissions:**
   ```bash
   cd auth-service
   rm -f auth.db
   bun run migrate.ts
   chmod 666 auth.db
   ```

2. **Bun not installed:**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   # Restart terminal after install
   ```

### NestJS Won't Build

**Problem:** TypeScript errors about client files

**Solution:**
- Already fixed in `tsconfig.build.json`
- Pull latest changes: `git pull origin feat/frontend-dashboard`

### Frontend Won't Start

**Problem:** npm install fails or vite not found

**Solutions:**

1. **Use legacy peer deps:**
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Check Node version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

---

## 📊 Port Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Auth Service | 3000 | http://localhost:3000 | Better Auth microservice |
| NestJS API | 3001 | http://localhost:3001 | Business logic (parts, workers) |
| Frontend | 5173 | http://localhost:5173 | React UI |

---

## 🔥 Quick Start (One Command Each)

If everything is already set up:

```bash
# Terminal 1
cd auth-service && bun run dev

# Terminal 2
npm start

# Terminal 3
cd client && npm run dev
```

Then open: http://localhost:5173

---

## 🛑 Stopping Services

**Press `Ctrl+C` in each terminal to stop the services**

Or kill by port:
```bash
lsof -ti :3000 | xargs kill -9  # Auth service
lsof -ti :3001 | xargs kill -9  # NestJS API
lsof -ti :5173 | xargs kill -9  # Frontend
```

---

## 📝 Environment Files

### Auth Service (.env)
```env
DATABASE_URL=file:./auth.db
PORT=3000
BETTER_AUTH_SECRET=demo-secret-change-for-production
BETTER_AUTH_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_AUTH_URL=http://localhost:3000
VITE_API_URL=http://localhost:3001
```

### NestJS API
No .env needed for local development (uses defaults)

---

## ✨ Tips

- **Keep all terminals visible** so you can see logs
- **Watch for errors** in each terminal
- **Use browser DevTools** (F12) to debug frontend issues
- **Check Network tab** to see API requests/responses
- **Clear browser cookies** if auth seems stuck

---

That's it! All three services should now be running and working together. 🎉
