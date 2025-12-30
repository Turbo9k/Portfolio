"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid credentials")
        setIsLoading(false)
        return
      }

      // Successfully authenticated - cookie is set automatically
      router.push("/admin/dashboard")
    } catch (err: any) {
      setError("Network error. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
              <p className="text-gray-400">Access the portfolio admin panel</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email / Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="admin@portfolio.com"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Default: admin@portfolio.com</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Portfolio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
