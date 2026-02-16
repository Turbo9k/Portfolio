// Project types
export interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  color: string
  status: "Live" | "In Development" | "Planning" | "Archived"
  role?: string
  stack?: string
  summary?: string
  challenges?: string
  background?: string
}

// Contact form types
export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
}

export interface ContactFormResponse {
  success: boolean
  message?: string
  error?: string
  mailtoLink?: string
}

// Dashboard metrics types
export interface DashboardMetrics {
  revenue: number
  users: number
  performance: number
  growth: number
}

export interface AnalyticsData {
  pageViews: number
  bounceRate: number
  avgSession: number
  conversion: string
}

// Chart data types
export interface ChartDataPoint {
  value: number
  revenue: number
  month: string
}

// Game types
export interface GameParticle {
  id: number
  x: number
  y: number
  caught: boolean
  isGlowing: boolean
  points: number
  lastCatchTime?: number
}

export interface FloatingParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
}

// Animation types
export interface MousePosition {
  x: number
  y: number
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Color options type
export type ColorOption = "blue" | "purple" | "green" | "red" | "yellow" | "pink" | "teal" | "orange"

// Status filter type
export type StatusFilter = "All" | "Live" | "In Development" | "Planning" | "Archived"

// Custom page – structured sections (replaces single markdown content)
export interface PageService {
  title: string
  bullets: string[]
}

export interface CustomPage {
  id: string
  title: string
  slug: string
  /** @deprecated Use structured fields; kept for backward compatibility when reading old pages */
  content?: string
  published: boolean
  createdAt: string
  updatedAt: string
  metaDescription?: string
  metaKeywords?: string
  showInNav?: boolean
  navLabel?: string
  showContactForm?: boolean
  // Structured sections
  hero_title?: string
  hero_description?: string
  services?: PageService[]
  pricing_text?: string
  advanced_features?: string
  cta_text?: string
}
