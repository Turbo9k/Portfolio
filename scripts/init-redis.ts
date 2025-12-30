/**
 * Script to initialize Upstash Redis with default data
 * Run this after setting up Upstash Redis on Vercel
 * 
 * Usage:
 * 1. Set environment variables:
 *    - UPSTASH_REDIS_REST_URL
 *    - UPSTASH_REDIS_REST_TOKEN
 * 2. Run: npx tsx scripts/init-redis.ts
 */

import { Redis } from "@upstash/redis"
import { readFileSync } from "fs"
import { join } from "path"

const KV_CONTENT_KEY = "portfolio:content"
const KV_PROJECTS_KEY = "portfolio:projects"

async function initRedis() {
  // Check for environment variables
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("❌ Error: Missing Upstash Redis environment variables")
    console.log("\nPlease set the following environment variables:")
    console.log("  - UPSTASH_REDIS_REST_URL")
    console.log("  - UPSTASH_REDIS_REST_TOKEN")
    console.log("\nYou can find these in your Vercel project settings after setting up Upstash Redis.")
    process.exit(1)
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    console.log("🔄 Connecting to Upstash Redis...")

    // Check if data already exists
    const existingContent = await redis.get(KV_CONTENT_KEY)
    const existingProjects = await redis.get(KV_PROJECTS_KEY)

    if (existingContent || existingProjects) {
      console.log("⚠️  Warning: Data already exists in Redis")
      console.log("   - Content exists:", !!existingContent)
      console.log("   - Projects exist:", !!existingProjects)
      console.log("\nSkipping initialization to preserve existing data.")
      console.log("If you want to reset, delete the keys first in your Upstash dashboard.")
      return
    }

    // Load default data from JSON files
    console.log("📂 Loading default data from JSON files...")
    
    const contentPath = join(process.cwd(), "data", "content.json")
    const projectsPath = join(process.cwd(), "data", "projects.json")

    const contentData = JSON.parse(readFileSync(contentPath, "utf-8"))
    const projectsData = JSON.parse(readFileSync(projectsPath, "utf-8"))

    // Initialize Redis with default data
    console.log("💾 Writing data to Redis...")
    
    await redis.set(KV_CONTENT_KEY, contentData)
    await redis.set(KV_PROJECTS_KEY, projectsData.projects)

    console.log("✅ Successfully initialized Redis with default data!")
    console.log("\nYour portfolio CMS is now ready to use on Vercel.")
    console.log("You can now edit content through the admin dashboard.")

  } catch (error: any) {
    console.error("❌ Error initializing Redis:", error.message)
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      console.log("\n💡 Tip: Check that your UPSTASH_REDIS_REST_TOKEN is correct")
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("connect")) {
      console.log("\n💡 Tip: Check that your UPSTASH_REDIS_REST_URL is correct")
    }
    process.exit(1)
  }
}

initRedis()

