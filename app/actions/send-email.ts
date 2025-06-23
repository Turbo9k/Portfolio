"use server"

import type { ContactFormResponse } from "@/lib/types"
import { validateContactForm } from "@/lib/validations"

export async function sendEmail(formData: FormData): Promise<ContactFormResponse> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const errors = validateContactForm(data)
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: Object.values(errors)[0], // Return first error
      }
    }

    // Create mailto link as fallback
    const subject = encodeURIComponent(`Portfolio Contact: ${data.name}`)
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\n---\nSent from Portfolio Contact Form`,
    )

    // For now, just return success with mailto link since Resend requires proper setup
    return {
      success: true,
      message: "Opening your email client to send the message.",
      mailtoLink: `mailto:iansiats9@gmail.com?subject=${subject}&body=${body}`,
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: "Failed to send message. Please try again or contact directly.",
    }
  }
}
