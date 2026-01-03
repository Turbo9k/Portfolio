/**
 * Script to initialize admin credentials in Redis
 * Run this once to set up your admin account
 * 
 * Usage:
 * 1. Set environment variables:
 *    - UPSTASH_REDIS_REST_URL or KV_REST_API_URL
 *    - UPSTASH_REDIS_REST_TOKEN or KV_REST_API_TOKEN
 * 2. Run: npx tsx scripts/init-admin.ts
 */

import { initializeAdminCredentials } from "../lib/auth"

async function init() {
  try {
    await initializeAdminCredentials()
    console.log("\n✅ Admin credentials initialized successfully!")
    console.log("\n⚠️  IMPORTANT: Change the default password immediately after first login!")
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error initializing admin credentials:", error.message)
    process.exit(1)
  }
}

init()


