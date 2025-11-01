"use server"

import type { ContactFormResponse } from "@/lib/types"
import { validateContactForm } from "@/lib/validations"
import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY || (process.env as any).Resend_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendEmail(formData: FormData): Promise<ContactFormResponse> {
  try {
    // Honeypot spam check
    const honeypot = (formData.get("company") as string) || ""
    if (honeypot.trim().length > 0) {
      return { success: true, message: "Thanks!" }
    }

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
        error: Object.values(errors)[0],
      }
    }

    const subject = encodeURIComponent(`Portfolio Contact: ${data.name}`)
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\n---\nSent from Portfolio Contact Form`,
    )

    if (resend) {
      try {
        const { error } = await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: "iansiats9@gmail.com",
          replyTo: data.email,
          subject: `Portfolio Contact: ${data.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px; white-space: pre-wrap;">
                  ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Sent from Portfolio Contact Form</p>
            </div>
          `,
        })

        if (!error) {
          return {
            success: true,
            message: "Message sent successfully! I'll get back to you soon.",
          }
        }

        console.error("Resend error:", error)
      } catch (err) {
        console.error("Resend exception:", err)
      }
    }

    // Fallback to mailto if Resend isn't configured or fails
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
