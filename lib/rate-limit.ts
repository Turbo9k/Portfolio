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

const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 // 15 minutes in seconds

export interface RateLimitResult {
  allowed: boolean
  remainingTime?: number
  attemptsRemaining?: number
}

/**
 * Check rate limit for an IP address using Redis
 * Returns whether the request is allowed and remaining lockout time if locked out
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (!redis) {
    // If Redis is not available, allow the request (fallback)
    return { allowed: true }
  }

  try {
    const key = `rate-limit:login:${ip}`
    const data = await redis.get<{ count: number; resetTime: number }>(key)

    if (!data) {
      return { allowed: true, attemptsRemaining: MAX_ATTEMPTS }
    }

    // Check if still locked out
    const now = Math.floor(Date.now() / 1000)
    if (data.count >= MAX_ATTEMPTS && data.resetTime > now) {
      const remainingTime = data.resetTime - now
      return {
        allowed: false,
        remainingTime: remainingTime * 1000, // Convert to milliseconds
        attemptsRemaining: 0,
      }
    }

    // Lockout expired, reset
    if (data.resetTime <= now) {
      await redis.del(key)
      return { allowed: true, attemptsRemaining: MAX_ATTEMPTS }
    }

    // Still within limit
    const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - data.count)
    return { allowed: true, attemptsRemaining }
  } catch (error) {
    console.error("Rate limit check error:", error)
    // On error, allow the request (fail open)
    return { allowed: true }
  }
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  if (!redis) return

  try {
    const key = `rate-limit:login:${ip}`
    const now = Math.floor(Date.now() / 1000)
    const resetTime = now + LOCKOUT_TIME

    const data = await redis.get<{ count: number; resetTime: number }>(key)

    if (!data) {
      // First attempt
      await redis.set(key, { count: 1, resetTime }, { ex: LOCKOUT_TIME })
    } else {
      // Increment count
      const newCount = data.count + 1
      await redis.set(key, { count: newCount, resetTime: data.resetTime }, { ex: LOCKOUT_TIME })
    }
  } catch (error) {
    console.error("Rate limit record error:", error)
  }
}

/**
 * Clear rate limit for successful login
 */
export async function recordSuccess(ip: string): Promise<void> {
  if (!redis) return

  try {
    const key = `rate-limit:login:${ip}`
    await redis.del(key)
  } catch (error) {
    console.error("Rate limit clear error:", error)
  }
}

