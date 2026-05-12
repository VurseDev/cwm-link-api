# 🚀 Complete Render Deployment Guide

Deploy your entire project (NestJS API + Auth Service + React Frontend) to Render for demonstration.

---

## 📦 Architecture Overview

You'll deploy **3 services**:

1. **NestJS API** (Port 3001) - Business logic, Parts, Workers
2. **Auth Service** (Port 3000) - Better Auth microservice
3. **React Frontend** (Static) - User interface

---

## 1️⃣ Deploy NestJS API

### Create Web Service

1. [Render Dashboard](https://dashboard.render.com/) → **"New +"** → **"Web Service"**
2. Connect repo: `VurseDev/cwm-link-api`

### Configuration

**Basic Settings:**
```
Name: cwm-link-api
Region: (Choose closest)
Branch: feat/frontend-dashboard
Root Directory: (leave empty - uses repo root)
Runtime: Node
```

**Build & Deploy:**

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=file:./prisma/dev.db
```

**Instance Type:** Free

### Deploy

- Click **"Create Web Service"**
- Wait for deployment (~3-5 minutes)
- **Save the URL**: `https://cwm-link-api.onrender.com`

### Test It

```bash
curl https://YOUR-NESTJS-URL.onrender.com/parts
```

---

## 2️⃣ Deploy Auth Service

### Create Web Service

1. Render Dashboard → **"New +"** → **"Web Service"**
2. Connect repo: `VurseDev/cwm-link-api`

### Configuration

**Basic Settings:**
```
Name: cwm-link-auth-service
Region: (Same as API)
Branch: feat/frontend-dashboard
Root Directory: auth-service
Runtime: Node
```

**Build & Deploy:**

**Build Command:**
```bash
curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install && bun run migrate.ts
```

**Start Command:**
```bash
export PATH="$HOME/.bun/bin:$PATH" && bun run dev
```

**Environment Variables:**
```
DATABASE_URL=file:./auth.db
PORT=3000
BETTER_AUTH_SECRET=generate-a-secure-random-secret-here
BETTER_AUTH_URL=https://cwm-link-auth-service.onrender.com
```

⚠️ Replace `cwm-link-auth-service` with YOUR actual service name!

**Instance Type:** Free

### Deploy

- Click **"Create Web Service"**
- Wait for deployment (~3-5 minutes)
- **Save the URL**: `https://cwm-link-auth-service.onrender.com`

### Test It

```bash
curl https://YOUR-AUTH-URL.onrender.com/health
```

---

## 3️⃣ Deploy Frontend

### Create Static Site

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect repo: `VurseDev/cwm-link-api`

### Configuration

**Basic Settings:**
```
Name: cwm-link-frontend
Branch: feat/frontend-dashboard
Root Directory: client
```

**Build Settings:**

**Build Command:**
```bash
npm install --legacy-peer-deps && npm run build
```

**Publish Directory:**
```
dist
```

**Environment Variables:**
```
VITE_AUTH_URL=https://YOUR-AUTH-SERVICE-URL.onrender.com
VITE_API_URL=https://YOUR-NESTJS-API-URL.onrender.com
```

⚠️ **CRITICAL**: Use the exact URLs from Steps 1 and 2!

### Deploy

- Click **"Create Static Site"**
- Wait for build (~2-3 minutes)
- **Save the URL**: `https://cwm-link-frontend.onrender.com`

---

## 4️⃣ Update CORS Settings

### Update Auth Service

Go to your **auth service** → **Environment** → Add:

```
ALLOWED_ORIGINS=https://YOUR-FRONTEND-URL.onrender.com
```

**OR** update `auth-service/src/auth.ts`:

```typescript
trustedOrigins: [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://YOUR-FRONTEND-URL.onrender.com",
],
```

Commit, push → Render auto-deploys.

### Update NestJS API (if needed)

If your NestJS API has CORS enabled, add frontend URL:

In `src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://YOUR-FRONTEND-URL.onrender.com',
  ],
  credentials: true,
});
```

---

## 📋 Final Configuration Summary

### NestJS API (`cwm-link-api`)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=file:./prisma/dev.db
```

### Auth Service (`cwm-link-auth-service`)
```env
DATABASE_URL=file:./auth.db
PORT=3000
BETTER_AUTH_SECRET=your-secure-secret
BETTER_AUTH_URL=https://cwm-link-auth-service.onrender.com
```

### Frontend (`cwm-link-frontend`)
```env
VITE_AUTH_URL=https://cwm-link-auth-service.onrender.com
VITE_API_URL=https://cwm-link-api.onrender.com
```

---

## ✅ Testing Your Deployment

### 1. Test NestJS API
```bash
curl https://YOUR-API.onrender.com/parts
```

### 2. Test Auth Service
```bash
curl https://YOUR-AUTH.onrender.com/health
```

### 3. Test Frontend

1. Visit: `https://YOUR-FRONTEND.onrender.com`
2. Register new account
3. Login successfully
4. Access dashboard (should show parts/workers)
5. Sign out

---

## 🎯 Quick Deployment Checklist

- [ ] Deploy NestJS API
- [ ] Note NestJS API URL
- [ ] Deploy Auth Service with correct `BETTER_AUTH_URL`
- [ ] Note Auth Service URL
- [ ] Deploy Frontend with both `VITE_AUTH_URL` and `VITE_API_URL`
- [ ] Update CORS in Auth Service
- [ ] Update CORS in NestJS API (if needed)
- [ ] Test API endpoints
- [ ] Test Auth endpoints
- [ ] Test Frontend registration
- [ ] Test Frontend login
- [ ] Test Dashboard access
- [ ] Test Sign out

---

## 🔧 Port Configuration Summary

**Local Development:**
- NestJS API: `http://localhost:3001`
- Auth Service: `http://localhost:3000`
- Frontend: `http://localhost:5173`

**Production (Render):**
- NestJS API: `https://cwm-link-api.onrender.com`
- Auth Service: `https://cwm-link-auth-service.onrender.com`
- Frontend: `https://cwm-link-frontend.onrender.com`

**Why Different Ports Locally:**
- Port 3000: Auth Service (Better Auth)
- Port 3001: NestJS API (Business logic)
- Port 5173: Vite dev server (Frontend)

This prevents port conflicts during development!

---

## ⚠️ Important Notes

### Free Tier Limitations
- Services sleep after 15 mins inactivity
- First request after sleep: ~30 seconds to wake
- Perfect for demos and testing!

### Database Persistence
- SQLite files persist on disk
- Data survives restarts
- Does NOT survive service deletions
- For production: use PostgreSQL

### Security
- `.env` files are NOT committed to git
- Use Render's environment variables
- Change `BETTER_AUTH_SECRET` for production
- Enable HTTPS-only cookies in production

---

## 🐛 Troubleshooting

### "Cannot connect to API"
✓ Check `VITE_API_URL` matches actual NestJS URL
✓ Check NestJS service is running (not sleeping)
✓ Check CORS settings in `main.ts`

### "Auth not working"
✓ Check `VITE_AUTH_URL` matches actual auth URL
✓ Check `BETTER_AUTH_URL` matches actual auth URL
✓ Check CORS in `auth.ts` includes frontend URL
✓ Clear browser cookies and retry

### "Service won't start"
✓ Check build logs for errors
✓ Verify environment variables are set
✓ Check build/start commands are correct

### "CORS errors in browser"
✓ Add frontend URL to both services
✓ Redeploy after CORS changes
✓ Clear browser cache

---

## 🚀 Production Upgrade Path

When you're ready for production:

1. **PostgreSQL Database**: Use Render's PostgreSQL addon
2. **Paid Instances**: Always-on, faster startup
3. **Custom Domain**: Point your domain to Render
4. **Environment Secrets**: Rotate all secrets
5. **SSL/HTTPS**: Enabled by default on Render
6. **Rate Limiting**: Add to auth endpoints
7. **Monitoring**: Set up logging and alerts

---

## 📚 Related Documentation

- **Frontend Auth Integration**: `FRONTEND_AUTH_INTEGRATION.md`
- **Auth Service Testing**: `auth-service/TESTING_GUIDE.md`
- **Auth Service README**: `auth-service/README.md`

---

That's it! Your complete application (API + Auth + Frontend) will be live on Render! 🎉
