// Application constants
export const APP_CONFIG = {
  name: "Ian Siats - Web Developer Portfolio",
  description: "Creative developer crafting exceptional digital experiences with cutting-edge web technologies.",
  url: process.env.NODE_ENV === "production" ? "https://iansiats.dev" : "http://localhost:3000",
  author: {
    name: "Ian Siats",
    email: "iansiats9@gmail.com",
    github: "https://github.com/Turbo9k",
    location: "Colorado, USA",
  },
} as const

// API endpoints
export const API_ENDPOINTS = {
  projects: "/api/projects",
  contact: "/api/contact",
} as const

// Animation constants
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
  },
  easing: {
    default: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
} as const

// Game constants
export const GAME_CONFIG = {
  particleCatcher: {
    maxSpeed: 8,
    catchRadius: 15,
    normalPoints: 10,
    glowingPoints: 25,
    glowingChance: 0.3,
    spawnInterval: 150,
    maxParticles: 4,
  },
} as const

// Chart colors
export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
} as const
