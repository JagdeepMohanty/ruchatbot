# 🚀 Vercel Deployment Guide

## Quick Deploy

```bash
npm install -g vercel
vercel
# Follow prompts
# Your app is live!
```

## Manual Steps

1. Build: `npm run build`
2. Install Vercel CLI: `npm i -g vercel`
3. Login: `vercel login`
4. Deploy: `vercel --prod`

## Configuration

Vercel auto-detects Vite configuration.

### vercel.json (optional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## Environment Variables

Add in Vercel dashboard under Environment Variables.

## Continuous Deployment

Connect GitHub repo to auto-deploy on push.
