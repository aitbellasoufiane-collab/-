# Souq M3alem Project

This project is built with React, Vite, and Express.

## Cloudflare Pages Deployment Instructions

If you are deploying this to **Cloudflare Pages**, use the following settings in the Cloudflare dashboard:

1.  **Framework Preset:** `Vite` (or None)
2.  **Build Command:** `npm run build`
3.  **Build Output Directory:** `dist`
4.  **Root Directory:** `/` (Default)

### Note on _redirects
A `public/_redirects` file has been added to handle Single Page Application (SPA) routing on Cloudflare.

### Note on Backend
This app uses a full-stack architecture. Cloudflare Pages (Static) will only host the frontend. If your app requires the `server.ts` logic (like Gemini API calls), you may need to adapt it for Cloudflare Workers or use a provider like Cloud Run/Vercel that supports Node.js backends.
