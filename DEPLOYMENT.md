# Deployment Guide (Render Backend + Vercel Frontend)

## 1. Backend deploy on Render

1. Push this repo to GitHub.
2. Go to Render -> New -> Blueprint and select this repo.
3. Render will read `render.yaml` and create backend service.
4. Open created service and set these env vars:

- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `FRONTEND_URL` = your Vercel URL (example: `https://ai-study-assistance.vercel.app`)
- `BACKEND_URL` = your Render URL (example: `https://ai-study-assistance-backend.onrender.com`)
- `ADDITIONAL_CORS_ORIGINS` (optional, comma-separated)

5. Confirm service is live at:
- `https://<your-backend>.onrender.com/`

## 2. Frontend deploy on Vercel

1. Go to Vercel -> Add New -> Project -> import same GitHub repo.
2. Configure project:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
3. Add environment variables:
- `REACT_APP_API_URL` = `https://<your-backend>.onrender.com/api`
- `REACT_APP_BASE_URL` = `https://<your-backend>.onrender.com`
4. Deploy.

`frontend/vercel.json` is already added for SPA routing support.

## 3. OAuth provider settings (required)

After both URLs are ready, update OAuth apps:

### Google OAuth
- Authorized JavaScript origin:
  - `https://<your-frontend>.vercel.app`
- Authorized redirect URI:
  - `https://<your-backend>.onrender.com/api/auth/google/callback`

### GitHub OAuth
- Homepage URL:
  - `https://<your-frontend>.vercel.app`
- Authorization callback URL:
  - `https://<your-backend>.onrender.com/api/auth/github/callback`

## 4. Final wiring

1. In Render backend env:
- set `FRONTEND_URL` to exact Vercel URL
- set `BACKEND_URL` to exact Render URL
2. In Vercel frontend env:
- set `REACT_APP_API_URL`
- set `REACT_APP_BASE_URL`
3. Redeploy both services.

## 5. Smoke test checklist

1. Open frontend URL.
2. Register/Login with email password.
3. Test Google/GitHub login.
4. Create a note from Study page.
5. Check Dashboard data loads.