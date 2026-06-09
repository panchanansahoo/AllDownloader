# Vercel + Render Deployment Setup

## Quick Start

### 1. Deploy Backend to Render

```bash
# Push code to GitHub
git add .
git commit -m "Setup Vercel + Render deployment"
git push
```

**On Render Dashboard:**
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Fill in:
   - **Name**: `viddrop-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run build --workspace backend`
   - **Start Command**: `npm run start --workspace backend`

4. **Click "Advanced"** and add environment variable:
   - **Key**: `CORS_ORIGIN`
   - **Value**: `https://your-app.vercel.app` (after you deploy to Vercel)

5. Click **Deploy**

6. **Copy the Render URL** (e.g., `https://viddrop-backend.onrender.com`)

---

### 2. Deploy Frontend to Vercel

**Via CLI:**
```bash
npm i -g vercel
vercel
```

**Or on Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import your GitHub repo
3. **Root Directory**: Leave empty (monorepo auto-detected)
4. Click **Deploy**

**After deployment:**
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://viddrop-backend.onrender.com`
   - **Environments**: Select all (Production, Preview, Development)

3. Click **Deploy** button to redeploy with new env vars

---

### 3. Update Render CORS

Now that Vercel URL is live, update Render CORS:

**On Render Dashboard:**
1. Go to your `viddrop-backend` service
2. Click **Environment** (or **Settings** → **Environment Variables**)
3. Find `CORS_ORIGIN`
4. Update value to: `https://your-app.vercel.app`
5. Click **Save** (this triggers a restart)

---

## Architecture Diagram

```
┌─────────────────────────┐
│   Vercel Frontend       │
│  https://app.vercel.app │
│  (React + Vite)         │
└────────────┬────────────┘
             │ fetch()
             │ VITE_API_BASE_URL=
             │ https://backend.onrender.com
             ↓
┌─────────────────────────┐
│   Render Backend        │
│ https://backend.        │
│ onrender.com            │
│ (Express + Node)        │
│ CORS_ORIGIN=            │
│ https://app.vercel.app  │
└─────────────────────────┘
```

---

## Testing

### 1. Test Backend Health
```bash
curl https://viddrop-backend.onrender.com/health
# Should return: {"ok":true}
```

### 2. Check Vercel Env Vars
On Vercel Dashboard → Settings → Environment Variables
Verify `VITE_API_BASE_URL` is set

### 3. Test Frontend API Call
1. Open your Vercel app in browser
2. Open DevTools Console
3. Try downloading a video
4. Check console for errors
5. Check Render logs for backend requests

---

## Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"
- ❌ Backend doesn't know about frontend URL
- ✅ Solution: Update `CORS_ORIGIN` on Render to match your Vercel URL exactly

### "Failed to fetch" Error
- ❌ Frontend doesn't know backend URL
- ✅ Solution: Check `VITE_API_BASE_URL` env var on Vercel dashboard

### Backend Returns 404
- ❌ Wrong base URL
- ✅ Test: `curl https://viddrop-backend.onrender.com/health`

### Cold Start (50 seconds)
- Normal on Render free tier
- App wakes up on first request
- Consider upgrading for instant starts

---

## Local Development

```bash
# Terminal 1: Backend (port 4001)
npm run dev --workspace backend

# Terminal 2: Frontend (port 5173)  
npm run dev --workspace frontend
```

Frontend proxy at `/api` routes to `localhost:4001` automatically.

---

## Environment Variables Summary

### Render Backend (.env)
```
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel Frontend (.env)
```
VITE_API_BASE_URL=https://viddrop-backend.onrender.com
```

---

## Useful Commands

```bash
# View Render logs
render logs viddrop-backend

# Check if backend is up
curl -I https://viddrop-backend.onrender.com/health

# Rebuild on Render
# Go to dashboard → More → Redeploy

# Rebuild on Vercel  
# Go to Deployments → click deployment → Redeploy
```
