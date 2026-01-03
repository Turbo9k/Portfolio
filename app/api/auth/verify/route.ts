import { NextRequest, NextResponse } from "next/server"
import { verifyToken, verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }
    
    // Verify JWT token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }
    
    // Verify session exists in Redis
    const sessionValid = await verifySession(token, decoded.userId)
    if (!sessionValid) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        email: decoded.userId,
      },
    })
  } catch (error: any) {
    console.error("Verify error:", error)
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    )
  }
}


