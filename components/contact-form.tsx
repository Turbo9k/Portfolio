"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { sendEmail } from "@/app/actions/send-email"

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {}
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name?.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!message?.trim()) {
      newErrors.message = "Message is required"
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) return

    startTransition(async () => {
      setSubmitStatus("idle")

      try {
        const result = await sendEmail(formData)

        if (result.success) {
          setSubmitStatus("success")
          setStatusMessage(result.message)

          // Open mailto link as backup
          if (result.mailtoLink) {
            window.open(result.mailtoLink, "_blank")
          }

          // Reset form
          const form = document.getElementById("contact-form") as HTMLFormElement
          form?.reset()
        } else {
          setSubmitStatus("error")
          setStatusMessage(result.error || "Failed to send message")
        }
      } catch (error) {
        setSubmitStatus("error")
        setStatusMessage("An unexpected error occurred. Please try again.")
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-8">
        <form id="contact-form" action={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
              className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                errors.name ? "border-red-400" : "border-white/20"
              }`}
              placeholder="Your full name"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                errors.email ? "border-red-400" : "border-white/20"
              }`}
              placeholder="your.email@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              onChange={handleInputChange}
              rows={5}
              className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors resize-none ${
                errors.message ? "border-red-400" : "border-white/20"
              }`}
              placeholder="Tell me about your project or just say hello!"
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
              {statusMessage}
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              {statusMessage}
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
