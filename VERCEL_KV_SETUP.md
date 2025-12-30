# Vercel KV Setup Instructions

To enable the CMS to work on Vercel, you need to set up Vercel KV (Redis-based key-value store).

## Steps:

1. **Install Vercel KV in your Vercel project:**
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to the "Storage" tab
   - Click "Create Database"
   - Select "KV" (Redis)
   - Create the KV store

2. **Link the KV store to your project:**
   - After creating the KV store, Vercel will automatically add the required environment variables
   - The environment variables `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc. will be automatically set

3. **Redeploy your project:**
   - After setting up KV, redeploy your project
   - The CMS will now use KV for storage instead of the read-only file system

## How it works:

- **Local Development**: Uses file system (`data/projects.json` and `data/content.json`)
- **Vercel Production**: Uses Vercel KV for storage (if configured)
- **Fallback**: If KV is not available, it tries file system, then shows an error

## Free Tier:

Vercel KV has a generous free tier that should be sufficient for a portfolio CMS.

