import { NextRequest, NextResponse } from "next/server"
import { verifyToken, verifySession, getAdminCredentials, hashPassword, saveAdminCredentials, verifyPassword } from "@/lib/auth"
import { validateEmail, validatePassword } from "@/lib/input-validation"

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
    const { email: rawEmail, currentPassword, newPassword } = body
    
    // Validate inputs exist
    if (!rawEmail || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, current password, and new password are required" },
        { status: 400 }
      )
    }

    // Validate and sanitize email
    const emailValidation = validateEmail(rawEmail)
    if (!emailValidation.valid || !emailValidation.email) {
      return NextResponse.json(
        { success: false, error: emailValidation.error || "Invalid email format" },
        { status: 400 }
      )
    }

    const email = emailValidation.email

    // Validate current password
    if (typeof currentPassword !== "string" || currentPassword.length === 0) {
      return NextResponse.json(
        { success: false, error: "Current password is required" },
        { status: 400 }
      )
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error || "Password does not meet requirements" },
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

