/**
 * Input validation and sanitization utilities
 */

/**
 * Validate and sanitize email address
 */
export function validateEmail(email: unknown): { valid: boolean; email?: string; error?: string } {
  if (typeof email !== "string") {
    return { valid: false, error: "Email must be a string" }
  }

  // Trim and normalize
  const trimmed = email.trim().toLowerCase()

  // Check length
  if (trimmed.length === 0) {
    return { valid: false, error: "Email is required" }
  }

  if (trimmed.length > 254) {
    return { valid: false, error: "Email is too long" }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Invalid email format" }
  }

  // Check for dangerous characters (basic XSS prevention)
  if (/[<>\"']/.test(trimmed)) {
    return { valid: false, error: "Email contains invalid characters" }
  }

  return { valid: true, email: trimmed }
}

/**
 * Validate password strength
 */
export function validatePassword(password: unknown): { valid: boolean; error?: string } {
  if (typeof password !== "string") {
    return { valid: false, error: "Password must be a string" }
  }

  // Check minimum length
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" }
  }

  // Check maximum length (prevent DoS)
  if (password.length > 128) {
    return { valid: false, error: "Password is too long" }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" }
  }

  return { valid: true }
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    return ""
  }

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength)

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"']/g, "")

  return sanitized
}


