import { NextResponse } from "next/server"
import { initializeAdminCredentials } from "@/lib/auth"

/**
 * Initialize admin credentials endpoint
 * Run this ONCE after setting up Redis to create default admin account
 * 
 * GET or POST /api/auth/init-admin
 */
export async function GET() {
  try {
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
        error: error.message || "Failed to initialize admin credentials",
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
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
        error: error.message || "Failed to initialize admin credentials",
      },
      { status: 500 }
    )
  }
}

