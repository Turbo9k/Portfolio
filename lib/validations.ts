import type { ContactFormData, ContactFormErrors } from "./types"
import { isValidEmail } from "./utils"

// Validate contact form
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  // Name validation
  if (!data.name?.trim()) {
    errors.name = "Name is required"
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  } else if (data.name.trim().length > 50) {
    errors.name = "Name must be less than 50 characters"
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = "Email is required"
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.message = "Message is required"
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters"
  } else if (data.message.trim().length > 1000) {
    errors.message = "Message must be less than 1000 characters"
  }

  return errors
}

// Validate project data
export function validateProject(project: Partial<any>): string[] {
  const errors: string[] = []

  if (!project.title?.trim()) {
    errors.push("Title is required")
  }

  if (!project.description?.trim()) {
    errors.push("Description is required")
  }

  if (!project.image?.trim()) {
    errors.push("Image/emoji is required")
  }

  if (!Array.isArray(project.tech) || project.tech.length === 0) {
    errors.push("At least one technology is required")
  }

  return errors
}
