# Upstash Redis Setup Instructions

To enable the CMS to work on Vercel, you need to set up Upstash Redis through the Vercel Marketplace.

## Steps:

1. **Install Upstash Redis in your Vercel project:**
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to the "Storage" tab or "Integrations"
   - Click "Browse Marketplace" or "Add Integration"
   - Search for "Upstash" and select "Upstash - Serverless DB"
   - Click "Add Integration" and follow the setup wizard

2. **Create a Redis Database:**
   - After adding the integration, you'll be prompted to create a Redis database
   - Choose a name for your database
   - Select a region close to your Vercel deployment
   - Create the database

3. **Environment Variables:**
   - After creating the database, Vercel will automatically add the required environment variables:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - These will be automatically available in your Vercel project

4. **Initialize Redis with default data (optional but recommended):**
   
   **Option A: Using the API endpoint (Easiest)**
   - After redeploying, visit: `https://your-site.vercel.app/api/init-redis`
   - Or use curl:
     ```bash
     curl -X POST https://your-site.vercel.app/api/init-redis
     ```
   - This will populate Redis with data from `data/content.json` and `data/projects.json`
   
   **Option B: Using the local script**
   - Get your environment variables from Vercel (Settings → Environment Variables)
   - Run locally with the environment variables:
     ```bash
     # Set environment variables (Windows PowerShell)
     $env:UPSTASH_REDIS_REST_URL="your-url-here"
     $env:UPSTASH_REDIS_REST_TOKEN="your-token-here"
     
     # Run the initialization script
     npm run init-redis
     ```
   - Or create a `.env.local` file with the variables and run `npm run init-redis`

5. **Redeploy your project:**
   - After setting up Upstash Redis, redeploy your project
   - The CMS will now use Redis for storage instead of the read-only file system

## How it works:

- **Local Development**: Uses file system (`data/projects.json` and `data/content.json`)
- **Vercel Production**: Uses Upstash Redis for storage (if configured)
- **Fallback**: If Redis is not available, it tries file system, then shows an error

## Free Tier:

Upstash Redis has a generous free tier (10,000 commands per day) that should be sufficient for a portfolio CMS.

