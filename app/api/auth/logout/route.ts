import { NextRequest, NextResponse } from "next/server"
import { verifyToken, deleteSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        await deleteSession(decoded.userId)
      }
    }
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
    
    // Clear the cookie
    response.cookies.delete("admin-token")
    
    return response
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}


