import { NextRequest, NextResponse } from "next/server"
import { verifyToken, verifySession } from "@/lib/auth"

export async function requireAuth(request: NextRequest): Promise<{ authenticated: boolean; response?: NextResponse }> {
  const token = request.cookies.get("admin-token")?.value
  
  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      ),
    }
  }
  
  const decoded = verifyToken(token)
  if (!decoded) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      ),
    }
  }
  
  const sessionValid = await verifySession(token, decoded.userId)
  if (!sessionValid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      ),
    }
  }
  
  return { authenticated: true }
}




