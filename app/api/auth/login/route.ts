import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, getAdminCredentials, generateToken, createSession, verifyToken } from "@/lib/auth"

// Rate limiting (simple in-memory store - use Redis in production for distributed systems)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

function getRateLimitKey(ip: string): string {
  return `login:${ip}`
}

function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const key = getRateLimitKey(ip)
  const attempt = loginAttempts.get(key)
  
  if (!attempt) {
    return { allowed: true }
  }
  
  if (attempt.count >= MAX_ATTEMPTS) {
    const remainingTime = attempt.resetTime - Date.now()
    if (remainingTime > 0) {
      return { allowed: false, remainingTime }
    } else {
      // Reset after lockout period
      loginAttempts.delete(key)
      return { allowed: true }
    }
  }
  
  return { allowed: true }
}

function recordFailedAttempt(ip: string): void {
  const key = getRateLimitKey(ip)
  const attempt = loginAttempts.get(key)
  
  if (!attempt) {
    loginAttempts.set(key, {
      count: 1,
      resetTime: Date.now() + LOCKOUT_TIME,
    })
  } else {
    loginAttempts.set(key, {
      count: attempt.count + 1,
      resetTime: attempt.resetTime,
    })
  }
}

function recordSuccess(ip: string): void {
  const key = getRateLimitKey(ip)
  loginAttempts.delete(key)
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown"
    
    // Check rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.remainingTime || 0) / 60000)
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please try again in ${minutes} minute(s).`,
        },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }
    
    // Get admin credentials from Redis
    const credentials = await getAdminCredentials()
    if (!credentials) {
      console.error("Login failed: No credentials found in Redis")
      recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Admin credentials not configured. Please run /api/auth/init-admin first." },
        { status: 500 }
      )
    }
    
    // Debug logging (remove in production)
    console.log("Login attempt:", {
      providedEmail: email,
      storedEmail: credentials.email,
      hasPasswordHash: !!credentials.passwordHash,
    })
    
    // Verify email
    if (email.toLowerCase() !== credentials.email.toLowerCase()) {
      console.error("Login failed: Email mismatch", {
        provided: email.toLowerCase(),
        stored: credentials.email.toLowerCase(),
      })
      recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Verify password
    if (!credentials.passwordHash) {
      console.error("Login failed: No password hash stored")
      recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Admin credentials not properly configured" },
        { status: 500 }
      )
    }
    
    const isValid = await verifyPassword(password, credentials.passwordHash)
    if (!isValid) {
      console.error("Login failed: Password mismatch")
      recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateToken(credentials.email)
    
    // Create session in Redis
    await createSession(token, credentials.email)
    
    // Record successful login
    recordSuccess(ip)
    
    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    })
    
    // Set secure HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })
    
    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

