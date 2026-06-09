# Vercel Frontend + Render Backend Deployment

## Architecture
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js Express)

## Backend Setup (Render)

### Step 1: Push to Git
```bash
git push
```

### Step 2: Deploy Backend on Render
1. Go to [render.com](https://render.com)
2. Create New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Name**: `viddrop-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm run build --workspace backend`
   - **Start Command**: `npm run start --workspace backend`
   - **Root Directory**: (leave empty or set to `/`)

### Step 3: Set Environment Variables on Render
Add these in Render dashboard → Environment:
```
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Step 4: Get Backend URL
After deployment, Render will give you a URL like:
```
https://viddrop-backend.onrender.com
```

---

## Frontend Setup (Vercel)

### Step 1: Create vercel.json
Already in root, configured for monorepo.

### Step 2: Deploy Frontend on Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel
```

### Step 3: Set Environment Variables on Vercel
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://viddrop-backend.onrender.com
```

Or during deployment:
```bash
vercel --env VITE_API_BASE_URL=https://viddrop-backend.onrender.com
```

### Step 4: Rebuild on Vercel
After setting env vars, trigger a rebuild to pick up the new API URL.

---

## Troubleshooting

### CORS Errors
1. Check Render backend logs
2. Verify `CORS_ORIGIN` matches your Vercel frontend URL exactly
3. Frontend should send requests to: `https://viddrop-backend.onrender.com/api/*`

### Fetch Errors
1. Check browser DevTools Console for actual error
2. Verify `VITE_API_BASE_URL` is set correctly on Vercel
3. Check Render backend is running: `https://viddrop-backend.onrender.com/health`

### Cold Start
Render free tier may have 50s cold start. The app will wake up on first request.

---

## Local Development
```bash
# Terminal 1: Backend (port 4001)
npm run dev --workspace backend

# Terminal 2: Frontend (port 5173)
npm run dev --workspace frontend
```

Frontend proxy will forward `/api` calls to `localhost:4001`
