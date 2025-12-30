import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Redis } from "@upstash/redis"

// Get Redis instance
let redis: Redis | null = null
try {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (redisUrl && redisToken) {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
  }
} catch {
  // Redis not available
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "your-super-secret-jwt-key-change-this-in-production"
const JWT_EXPIRES_IN = "7d"
const ADMIN_CREDENTIALS_KEY = "portfolio:admin:credentials"
const SESSION_KEY_PREFIX = "portfolio:admin:session:"

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token management
export function generateToken(userId: string): string {
  return jwt.sign(
    { userId, type: "admin" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token: string): { userId: string; type: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
    return decoded
  } catch {
    return null
  }
}

// Admin credentials management
export interface AdminCredentials {
  email: string
  passwordHash: string
}

export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  if (!redis) return null
  
  try {
    const credentials = await redis.get<AdminCredentials>(ADMIN_CREDENTIALS_KEY)
    return credentials
  } catch {
    return null
  }
}

export async function saveAdminCredentials(email: string, passwordHash: string): Promise<boolean> {
  if (!redis) return false
  
  try {
    await redis.set(ADMIN_CREDENTIALS_KEY, {
      email,
      passwordHash,
      updatedAt: new Date().toISOString(),
    })
    return true
  } catch {
    return false
  }
}

// Session management
export async function createSession(token: string, userId: string): Promise<boolean> {
  if (!redis) return false
  
  try {
    const sessionKey = `${SESSION_KEY_PREFIX}${userId}`
    await redis.set(sessionKey, token, { ex: 7 * 24 * 60 * 60 }) // 7 days
    return true
  } catch {
    return false
  }
}

export async function verifySession(token: string, userId: string): Promise<boolean> {
  if (!redis) return false
  
  try {
    const sessionKey = `${SESSION_KEY_PREFIX}${userId}`
    const storedToken = await redis.get<string>(sessionKey)
    return storedToken === token
  } catch {
    return false
  }
}

export async function deleteSession(userId: string): Promise<boolean> {
  if (!redis) return false
  
  try {
    const sessionKey = `${SESSION_KEY_PREFIX}${userId}`
    await redis.del(sessionKey)
    return true
  } catch {
    return false
  }
}

// Initialize default admin credentials if none exist
export async function initializeAdminCredentials(): Promise<void> {
  const existing = await getAdminCredentials()
  if (existing) return
  
  // Create default admin with hashed password
  const defaultEmail = "admin@portfolio.com"
  const defaultPassword = "ChangeThisPassword123!"
  const passwordHash = await hashPassword(defaultPassword)
  
  await saveAdminCredentials(defaultEmail, passwordHash)
  console.log("Default admin credentials initialized")
  console.log(`Email: ${defaultEmail}`)
  console.log(`Password: ${defaultPassword}`)
  console.log("⚠️  IMPORTANT: Change these credentials immediately!")
}

