import { NextRequest, NextResponse } from "next/server"
import { verifyToken, verifySession, getAdminCredentials, hashPassword, saveAdminCredentials, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("admin-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }
    
    const sessionValid = await verifySession(token, decoded.userId)
    if (!sessionValid) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { email, currentPassword, newPassword } = body
    
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, current password, and new password are required" },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long" },
        { status: 400 }
      )
    }
    
    // Get current credentials
    const credentials = await getAdminCredentials()
    if (!credentials) {
      return NextResponse.json(
        { success: false, error: "Admin credentials not found" },
        { status: 500 }
      )
    }
    
    // Verify current password
    const isValid = await verifyPassword(currentPassword, credentials.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      )
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)
    
    // Save new credentials
    const saved = await saveAdminCredentials(email, newPasswordHash)
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save credentials" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Credentials updated successfully",
    })
  } catch (error: any) {
    console.error("Update credentials error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

