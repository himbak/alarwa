# Backend Deployment Guide for Vercel

## ⚠️ Important Note
Vercel's free tier does not support long-running applications like Express servers.

## Option 1: Use Vercel Functions (Recommended for REST API)
If you want to deploy your Express backend on Vercel, follow this guide:
https://vercel.com/docs/concepts/functions/serverless-functions

You would need to:
1. Convert your Express routes to Serverless Functions
2. Create `/api/` folder in the root
3. Each route becomes an individual function

## Option 2: Deploy Backend Elsewhere (Recommended)
Host your Express backend on:
- **Render.com** - Free tier available
- **Railway.app** - Free tier available  
- **Heroku** (no longer free)
- **AWS** - Has a free tier
- **DigitalOcean** - Low cost VPS

## Option 3: Vercel + Backend Proxy
1. Deploy frontend on Vercel
2. Deploy backend on a separate service (Render, Railway, etc.)
3. Frontend calls backend via the deployed URL
4. Configure CORS in backend to allow Vercel domain

## For this project:
1. Deploy frontend to Vercel
2. Deploy backend to Render.com or Railway.app
3. Update `NEXT_PUBLIC_API_URL` env var in Vercel dashboard with your backend URL
