"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Mail, MapPin, Github, ExternalLink, Award, Code } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  const handleDownload = () => {
    // Download the PDF file
    const link = document.createElement('a')
    link.href = '/Ian_Siats_Resume.pdf'
    link.download = 'Ian_Siats_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Portfolio</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Resume
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Header Section */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300 w-full">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white print:text-black">IAN SIATS</h1>
                <h2 className="text-lg sm:text-xl md:text-2xl text-blue-400 print:text-blue-600 mb-4 sm:mb-6 font-medium">Full-Stack Web Developer</h2>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-gray-300 print:text-gray-700 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>iansiats9@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Colorado, USA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>github.com/Turbo9k</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <a href="https://iansiats.vercel.app" target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 hover:text-blue-400">
                      iansiats.vercel.app
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300 w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white print:text-black text-lg sm:text-xl font-bold uppercase tracking-wide">
                PROFESSIONAL SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-gray-300 print:text-gray-700 leading-relaxed text-sm sm:text-base">
                Self-taught Full-Stack Web Developer seeking an entry-level position to launch my professional career.
                Through intensive self-directed learning, I have developed strong proficiency in modern web
                development technologies including React, Next.js, TypeScript, and full-stack JavaScript development.
                My portfolio demonstrates hands-on experience building production-ready applications with complex
                features such as payment processing, authentication systems, and responsive user interfaces. Highly
                motivated, detail-oriented, and committed to writing clean, maintainable code that follows industry best
                practices.
              </p>
            </CardContent>
          </Card>

          {/* Featured Projects */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300 w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white print:text-black text-lg sm:text-xl font-bold uppercase tracking-wide">
                FEATURED PROJECTS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-6 sm:space-y-8">
              {/* Project 1 */}
              <div className="border-l-2 border-blue-500/30 pl-3 sm:pl-4 print:border-blue-600">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h4 className="font-semibold text-white print:text-black text-base sm:text-lg break-words">
                    Full-Stack E-Commerce Platform (2024) — <span className="text-blue-400 print:text-blue-600">Live Demo</span> | <span className="text-blue-400 print:text-blue-600">GitHub</span>
                  </h4>
                </div>
                <div className="mb-3 space-y-1">
                  <p className="text-xs sm:text-sm text-blue-400 print:text-blue-600 font-medium break-words">
                    <a href="https://ecommerce-store-mu-five.vercel.app" target="_blank" rel="noopener noreferrer" className="underline break-all">https://ecommerce-store-mu-five.vercel.app</a>
                  </p>
                  <p className="text-xs sm:text-sm text-blue-400 print:text-blue-600 font-medium break-words">
                    <a href="https://github.com/Turbo9k/Ecommerce" target="_blank" rel="noopener noreferrer" className="underline break-all">https://github.com/Turbo9k/Ecommerce</a>
                  </p>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">
                  Built and deployed a full-stack e-commerce application supporting end-to-end shopping and checkout
                  functionality. Implemented secure payment processing using Stripe, dynamic inventory management,
                  and real-time order tracking. Developed a responsive UI for seamless cross-device experience.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-1.5 ml-4 mb-3 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 print:text-blue-600 mt-1 flex-shrink-0">•</span>
                    <span>Implemented secure Stripe payment workflow with webhook validation and error handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 print:text-blue-600 mt-1 flex-shrink-0">•</span>
                    <span>Built RESTful API with authentication, product filtering, and cart management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 print:text-blue-600 mt-1 flex-shrink-0">•</span>
                    <span>Designed relational PostgreSQL schema with optimized queries for fast product and order retrieval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 print:text-blue-600 mt-1 flex-shrink-0">•</span>
                    <span>Developed admin dashboard with order management and sales tracking</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-400 print:text-gray-600 italic">
                  Tech Stack: React • Node.js • Express.js • PostgreSQL • Stripe • REST APIs • JWT Auth • Tailwind CSS
                </p>
              </div>

              {/* Project 2 */}
              <div className="border-l-2 border-green-500/30 pl-3 sm:pl-4 print:border-green-600">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h4 className="font-semibold text-white print:text-black text-base sm:text-lg break-words">
                    Task Management App (2024) — <span className="text-green-400 print:text-green-600">Live Demo</span> | <span className="text-green-400 print:text-green-600">GitHub</span>
                  </h4>
                </div>
                <div className="mb-3 space-y-1">
                  <p className="text-xs sm:text-sm text-green-400 print:text-green-600 font-medium break-words">
                    <a href="https://task-managment-mauve.vercel.app" target="_blank" rel="noopener noreferrer" className="underline break-all">https://task-managment-mauve.vercel.app</a>
                  </p>
                  <p className="text-xs sm:text-sm text-green-400 print:text-green-600 font-medium break-words">
                    <a href="https://github.com/Turbo9k/Task_managment" target="_blank" rel="noopener noreferrer" className="underline break-all">https://github.com/Turbo9k/Task_managment</a>
                  </p>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">
                  Developed a real-time collaborative task management platform enabling team task sharing, project
                  tracking, and synchronized updates. Built a websocket-powered architecture to support multi-user state
                  updates.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-1.5 ml-4 mb-3 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 print:text-green-600 mt-1 flex-shrink-0">•</span>
                    <span>Implemented real-time communication using Socket.io for instant updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 print:text-green-600 mt-1 flex-shrink-0">•</span>
                    <span>Built secure role-based access control with protected routes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 print:text-green-600 mt-1 flex-shrink-0">•</span>
                    <span>Created RESTful API for tasks, projects, and activity tracking using Express.js</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 print:text-green-600 mt-1 flex-shrink-0">•</span>
                    <span>Designed relational MySQL schema ensuring data integrity for users, teams, and permissions</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-400 print:text-gray-600 italic">
                  Tech Stack: Vue.js • Node.js • Express.js • Socket.io • MySQL • REST APIs • RBAC • Session Auth
                </p>
              </div>

              {/* Project 3 */}
              <div className="border-l-2 border-purple-500/30 pl-3 sm:pl-4 print:border-purple-600">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h4 className="font-semibold text-white print:text-black text-base sm:text-lg break-words">
                    Enterprise Admin Dashboard (2024) — <span className="text-purple-400 print:text-purple-600">Live Demo</span> | <span className="text-purple-400 print:text-purple-600">GitHub</span>
                  </h4>
                </div>
                <div className="mb-3 space-y-1">
                  <p className="text-xs sm:text-sm text-purple-400 print:text-purple-600 font-medium break-words">
                    <a href="https://cognivex.vercel.app" target="_blank" rel="noopener noreferrer" className="underline break-all">https://cognivex.vercel.app</a>
                  </p>
                  <p className="text-xs sm:text-sm text-purple-400 print:text-purple-600 font-medium break-words">
                    <a href="https://github.com/Turbo9k/cognivex" target="_blank" rel="noopener noreferrer" className="underline break-all">https://github.com/Turbo9k/cognivex</a>
                  </p>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">
                  Engineered a full-stack enterprise dashboard with role-based access control (RBAC), authentication,
                  and data visualization capabilities. Built with Next.js 14 App Router and TypeScript for type-safe
                  development and efficient routing.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-1.5 ml-4 mb-3 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 print:text-purple-600 mt-1 flex-shrink-0">•</span>
                    <span>Implemented JWT authentication + RBAC to secure protected routes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 print:text-purple-600 mt-1 flex-shrink-0">•</span>
                    <span>Leveraged Next.js 14 App Router for SSR and dynamic routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 print:text-purple-600 mt-1 flex-shrink-0">•</span>
                    <span>Designed MongoDB models and API routes for efficient data retrieval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 print:text-purple-600 mt-1 flex-shrink-0">•</span>
                    <span>Built reusable UI components with Tailwind CSS utility-first patterns</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-400 print:text-gray-600 italic">
                  Tech Stack: Next.js 14 • TypeScript • Tailwind CSS • MongoDB • JWT Auth • Server Components • API Routes
                </p>
              </div>

              {/* Project 4 */}
              <div className="border-l-2 border-yellow-500/30 pl-3 sm:pl-4 print:border-yellow-600">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h4 className="font-semibold text-white print:text-black text-base sm:text-lg break-words">
                    Advanced Calculator Application (2024) — <span className="text-yellow-400 print:text-yellow-600">GitHub</span>
                  </h4>
                </div>
                <div className="mb-3 space-y-1">
                  <p className="text-xs sm:text-sm text-yellow-400 print:text-yellow-600 font-medium break-words">
                    <a href="https://github.com/Turbo9k/Calculator" target="_blank" rel="noopener noreferrer" className="underline break-all">https://github.com/Turbo9k/Calculator</a>
                  </p>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">
                  Developed a scientific calculator supporting advanced math functions, calculation history, and
                  persistent data storage. Applied modular code architecture and intuitive UI/UX design for accessibility
                  and performance.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-1.5 ml-4 mb-3 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 print:text-yellow-600 mt-1 flex-shrink-0">•</span>
                    <span>Built reusable JavaScript functions supporting 50+ scientific operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 print:text-yellow-600 mt-1 flex-shrink-0">•</span>
                    <span>Implemented LocalStorage for multi-session data persistence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 print:text-yellow-600 mt-1 flex-shrink-0">•</span>
                    <span>Designed mobile-responsive UI with error handling and keyboard support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 print:text-yellow-600 mt-1 flex-shrink-0">•</span>
                    <span>Added animated UI interactions for enhanced usability</span>
                  </li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-400 print:text-gray-600 italic">
                  Tech Stack: JavaScript (ES6) • Python • CSS3 • LocalStorage • HTML5 • DOM Manipulation • UI/UX
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300 w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white print:text-black text-lg sm:text-xl font-bold uppercase tracking-wide">
                TECHNICAL SKILLS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-2 sm:mb-3 text-sm sm:text-base">Frontend:</h4>
                  <p className="text-gray-300 print:text-gray-700 text-sm sm:text-base">
                    React • Next.js • TypeScript • JavaScript (ES6) • HTML5 • CSS3 • Tailwind CSS • Responsive Web Design • UI/UX
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-2 sm:mb-3 text-sm sm:text-base">Backend & Databases:</h4>
                  <p className="text-gray-300 print:text-gray-700 text-sm sm:text-base">
                    Node.js • Express.js • Python • REST APIs • PostgreSQL • MongoDB • JWT Auth • CRUD • MVC Architecture • API Integration
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-2 sm:mb-3 text-sm sm:text-base">Tools & Technologies:</h4>
                  <p className="text-gray-300 print:text-gray-700 text-sm sm:text-base">
                    Git • GitHub • Vercel • Stripe • Docker (basic) • D3.js • CI/CD • Linux • Agile Scrum • Figma • Unit Testing • Postman • VS Code
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Journey */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300 w-full">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white print:text-black text-lg sm:text-xl font-bold uppercase tracking-wide">
                LEARNING JOURNEY & EDUCATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h4 className="font-semibold text-white print:text-black text-base sm:text-lg break-words">
                    Self-Directed Full-Stack Web Development Program
                  </h4>
                  <span className="text-xs sm:text-sm text-gray-400 print:text-gray-600">2022 - Present</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 text-sm sm:text-base">
                  Completed coursework in JavaScript ES6, React, Next.js, Node.js, TypeScript, and modern web
                  development frameworks through online platforms, documentation, and hands-on projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          .print\\:text-blue-600 {
            color: #2563eb !important;
          }
          .print\\:bg-blue-100 {
            background-color: #dbeafe !important;
          }
          .print\\:text-blue-800 {
            color: #1e40af !important;
          }
          .print\\:bg-purple-100 {
            background-color: #ede9fe !important;
          }
          .print\\:text-purple-800 {
            color: #5b21b6 !important;
          }
          .print\\:bg-blue-600 {
            background-color: #2563eb !important;
          }
          .print\\:bg-purple-600 {
            background-color: #9333ea !important;
          }
          .print\\:border-green-600 {
            border-color: #16a34a !important;
          }
          .print\\:text-green-800 {
            color: #166534 !important;
          }
          .print\\:bg-green-100 {
            background-color: #dcfce7 !important;
          }
        }
      `}</style>
    </div>
  )
}
