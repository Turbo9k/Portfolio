"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)

  const handleInit = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/auth/init-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: "Admin credentials initialized successfully!",
          data: data,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to initialize admin credentials",
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">Initialize Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              <strong>What this does:</strong> Creates the default admin account in Redis. This should only be run once after setting up your site.
            </p>
          </div>

          {result && (
            <Alert className={result.success ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <AlertDescription className={result.success ? "text-green-400" : "text-red-400"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {result?.success && result.data && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
              <p className="text-yellow-400 font-semibold">Default Credentials:</p>
              <div className="space-y-1 text-sm">
                <p className="text-white">
                  <span className="text-gray-400">Email:</span> {result.data.defaultEmail}
                </p>
                <p className="text-white">
                  <span className="text-gray-400">Password:</span> {result.data.defaultPassword}
                </p>
              </div>
              <p className="text-yellow-400 text-xs mt-3">
                ⚠️ <strong>IMPORTANT:</strong> Change these credentials immediately after first login!
              </p>
            </div>
          )}

          <Button
            onClick={handleInit}
            disabled={isLoading || result?.success}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : result?.success ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Already Initialized
              </>
            ) : (
              "Initialize Admin Account"
            )}
          </Button>

          {result?.success && (
            <div className="text-center">
              <a
                href="/admin/login"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Go to Login Page →
              </a>
            </div>
          )}

          <div className="text-xs text-gray-400 space-y-1">
            <p><strong>Note:</strong> If admin credentials already exist, this will not overwrite them.</p>
            <p>This endpoint can be safely called multiple times - it only creates credentials if none exist.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




