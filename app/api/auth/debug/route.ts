import { NextResponse } from "next/server"
import { getAdminCredentials } from "@/lib/auth"

/**
 * Debug endpoint to check admin credentials
 * GET /api/auth/debug
 * 
 * This helps troubleshoot login issues by showing what's stored in Redis
 */
export async function GET() {
  try {
    const credentials = await getAdminCredentials()
    
    if (!credentials) {
      return NextResponse.json({
        success: false,
        message: "No admin credentials found in Redis",
        suggestion: "Run /api/auth/init-admin to initialize credentials",
      })
    }
    
    return NextResponse.json({
      success: true,
      credentials: {
        email: credentials.email,
        passwordHash: credentials.passwordHash ? `${credentials.passwordHash.substring(0, 20)}...` : "missing",
        hasPasswordHash: !!credentials.passwordHash,
      },
      message: "Credentials found in Redis",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check credentials",
      },
      { status: 500 }
    )
  }
}




