import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, getAdminCredentials, generateToken, createSession } from "@/lib/auth"
import { checkRateLimit, recordFailedAttempt, recordSuccess } from "@/lib/rate-limit"
import { validateEmail } from "@/lib/input-validation"

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting (use first IP from X-Forwarded-For to prevent spoofing)
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0]?.trim() || 
               request.headers.get("x-real-ip") || 
               "unknown"
    
    // Check rate limiting
    const rateLimit = await checkRateLimit(ip)
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
    const { email: rawEmail, password } = body
    
    // Validate input types
    if (!rawEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate and sanitize email
    const emailValidation = validateEmail(rawEmail)
    if (!emailValidation.valid || !emailValidation.email) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const email = emailValidation.email

    // Validate password is a string and not empty
    if (typeof password !== "string" || password.length === 0) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Prevent extremely long passwords (DoS protection)
    if (password.length > 128) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Get admin credentials from Redis
    const credentials = await getAdminCredentials()
    if (!credentials) {
      // Don't reveal that credentials don't exist - use generic error
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Verify email (case-insensitive)
    if (email !== credentials.email.toLowerCase()) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Verify password
    if (!credentials.passwordHash) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    const isValid = await verifyPassword(password, credentials.passwordHash)
    if (!isValid) {
      await recordFailedAttempt(ip)
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateToken(credentials.email)
    
    // Create session in Redis
    await createSession(token, credentials.email)
    
    // Record successful login (clear rate limit)
    await recordSuccess(ip)
    
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
    // Log error server-side but don't expose details to client
    console.error("Login error:", error)
    
    // Try to record failed attempt if we have IP
    try {
      const forwardedFor = request.headers.get("x-forwarded-for")
      const ip = forwardedFor?.split(",")[0]?.trim() || 
                 request.headers.get("x-real-ip") || 
                 "unknown"
      await recordFailedAttempt(ip)
    } catch {
      // Ignore rate limit errors
    }
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

