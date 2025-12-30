"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminCredentials {
  email: string
  password: string
}

interface AdminCredentialsEditorProps {
  credentials: AdminCredentials
  onSave: (credentials: AdminCredentials) => void
  onCancel: () => void
}

export function AdminCredentialsEditor({ credentials, onSave, onCancel }: AdminCredentialsEditorProps) {
  const [formData, setFormData] = useState<AdminCredentials>(credentials)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setFormData(credentials)
  }, [credentials])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required to make changes"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Verify current password
    const storedPassword = localStorage.getItem("admin-password") || "portfolio2024"
    if (currentPassword !== storedPassword) {
      setErrors({ currentPassword: "Current password is incorrect" })
      setMessage({ type: "error", text: "Current password verification failed" })
      return
    }

    if (validateForm()) {
      // Store new password in localStorage (in production, use proper auth)
      localStorage.setItem("admin-email", formData.email)
      localStorage.setItem("admin-password", formData.password)
      
      onSave(formData)
      setMessage({ type: "success", text: "Admin credentials updated successfully!" })
      
      // Clear form after successful save
      setTimeout(() => {
        setCurrentPassword("")
        setMessage(null)
      }, 2000)
    }
  }

  const handleChange = (field: keyof AdminCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Admin Credentials</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <Alert className={message.type === "error" ? "bg-red-500/20 border-red-500/30" : "bg-green-500/20 border-green-500/30"}>
                <AlertDescription className={message.type === "error" ? "text-red-400" : "text-green-400"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                <strong>Security Note:</strong> These credentials are stored locally. For production, implement proper authentication with hashed passwords and secure storage.
              </p>
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Current Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (errors.currentPassword) {
                      setErrors((prev) => ({ ...prev, currentPassword: "" }))
                    }
                  }}
                  className={`pl-10 pr-10 bg-white/10 border text-white placeholder-gray-400 ${
                    errors.currentPassword ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter current password to verify"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && <p className="mt-1 text-sm text-red-400">{errors.currentPassword}</p>}
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Admin Email/Username *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-10 bg-white/10 border text-white placeholder-gray-400 ${
                    errors.email ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-10 pr-10 bg-white/10 border text-white placeholder-gray-400 ${
                    errors.password ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters long</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Update Credentials
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="border-white/20 hover:bg-white/10">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

