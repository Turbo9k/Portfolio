"use server"

import type { ContactFormResponse } from "@/lib/types"
import { validateContactForm } from "@/lib/validations"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Replace the simulation section with:
    try {
      const { data, error } = await resend.emails.send({
        from: "contact@yourdomain.com", // Use your verified domain
        to: "iansiats9@gmail.com",
        subject: `Portfolio Contact: ${data.name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${data.message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Sent from Portfolio Contact Form</p>
      </div>
    `,
      })

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Fallback to mailto
      return {
        success: true,
        message: "Opening your email client as backup.",
        mailtoLink: `mailto:iansiats9@gmail.com?subject=${subject}&body=${body}`,
      }
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: "Failed to send message. Please try again or contact directly.",
    }
  }
}
