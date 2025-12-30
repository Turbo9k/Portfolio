import { NextRequest, NextResponse } from "next/server"
import { initializeAdminCredentials, getAdminCredentials } from "@/lib/auth"

/**
 * Initialize admin credentials endpoint
 * Run this ONCE after setting up Redis to create default admin account
 * 
 * SECURITY: Only allows initialization if:
 * 1. No admin credentials exist yet, OR
 * 2. INIT_ADMIN_SECRET environment variable is provided and matches
 * 
 * GET or POST /api/auth/init-admin
 * POST body (optional): { secret: "your-init-secret" }
 */
async function isInitAllowed(request?: NextRequest): Promise<boolean> {
  // Check if credentials already exist
  const existing = await getAdminCredentials()
  if (existing) {
    // Credentials exist - require secret to reinitialize
    const initSecret = process.env.INIT_ADMIN_SECRET
    if (!initSecret) {
      return false // No secret configured, disallow reinitialization
    }

    // Check if secret was provided
    if (request) {
      try {
        const body = await request.json().catch(() => ({}))
        return body.secret === initSecret
      } catch {
        return false
      }
    }

    // GET request with credentials existing - disallow
    return false
  }

  // No credentials exist - allow initialization
  return true
}

export async function GET() {
  try {
    const allowed = await isInitAllowed()
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin credentials already exist. Use POST with INIT_ADMIN_SECRET to reinitialize.",
        },
        { status: 403 }
      )
    }

    await initializeAdminCredentials()
    
    return NextResponse.json({
      success: true,
      message: "Admin credentials initialized successfully",
      defaultEmail: "admin@portfolio.com",
      defaultPassword: "ChangeThisPassword123!",
      warning: "⚠️ IMPORTANT: Change these credentials immediately after first login!",
    })
  } catch (error: any) {
    console.error("Init admin error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize admin credentials",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const allowed = await isInitAllowed(request)
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Initialization not allowed. Admin credentials may already exist, or invalid secret provided.",
        },
        { status: 403 }
      )
    }

    await initializeAdminCredentials()
    
    return NextResponse.json({
      success: true,
      message: "Admin credentials initialized successfully",
      defaultEmail: "admin@portfolio.com",
      defaultPassword: "ChangeThisPassword123!",
      warning: "⚠️ IMPORTANT: Change these credentials immediately after first login!",
    })
  } catch (error: any) {
    console.error("Init admin error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize admin credentials",
      },
      { status: 500 }
    )
  }
}

