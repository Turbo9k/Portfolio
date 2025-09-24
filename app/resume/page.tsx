"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Mail, MapPin, Github, ExternalLink, Award, Code } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  const handleDownload = () => {
    // Create a print-friendly version
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Resume
            </h1>
          </div>
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2 text-white print:text-black">Ian Siats</h1>
                <h2 className="text-xl text-blue-400 print:text-blue-600 mb-4">Creative Web Developer</h2>
                <div className="flex flex-wrap justify-center gap-6 text-gray-300 print:text-gray-700">
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
                      https://iansiats.vercel.app
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 print:text-gray-700 leading-relaxed">
                Passionate and self-motivated web developer with a strong foundation in modern web technologies and a
                keen eye for user experience design. Demonstrated ability to learn quickly and adapt to new technologies
                while maintaining attention to detail and quality. Experienced in client service and problem-solving
                through previous work in hospitality management. Seeking to leverage technical skills and
                customer-focused mindset to contribute to innovative web development projects.
              </p>
            </CardContent>
          </Card>

          {/* Technical Skills */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3">Frontend Development</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["HTML5", "CSS3", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-400 print:bg-blue-100 print:text-blue-800 border-blue-500/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3">Backend & Tools</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      "Node.js",
                      "Python",
                      "PostgreSQL",
                      "MongoDB",
                      "D3.js",
                      "Stripe API",
                      "Git",
                      "GitHub",
                      "Vercel",
                      "Responsive Design",
                      "UI/UX Design",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-400 print:bg-purple-100 print:text-purple-800 border-purple-500/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Featured Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black">E-Commerce Platform</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-2">
                  Full-stack e-commerce solution with product management, payment integration, and real-time inventory
                  tracking.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["React", "Node.js", "PostgreSQL", "Stripe API"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600">
                  Live Demo: ecommerce-store-mu-five.vercel.app
                </p>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black">Advanced Calculator Application</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-2">
                  Sophisticated calculator with scientific functions, history tracking, and modern responsive UI design.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["JavaScript", "Python", "CSS3", "LocalStorage"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600">GitHub: github.com/Turbo9k/Calculator</p>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black">Cognivex Admin Dashboard</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-2">
                  Comprehensive admin dashboard with JWT authentication, role management, and real-time monitoring
                  capabilities.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Next.js 14", "TypeScript", "Tailwind CSS", "MongoDB"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600">Live Demo: cognivex.vercel.app</p>
              </div>
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Education & Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white print:text-black mb-2">
                  Self-Directed Web Development Education
                </h4>
                <p className="text-gray-300 print:text-gray-700 mb-2">
                  Comprehensive self-study program focusing on modern web development technologies and best practices.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Completed online courses in JavaScript, React, Node.js, and modern web development practices
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Built multiple full-stack projects demonstrating proficiency in frontend and backend technologies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Active contributor to open-source projects and continuous learner of emerging technologies
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black">Key Strengths & Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3">Technical Abilities</h4>
                  <ul className="text-gray-300 print:text-gray-700 space-y-2">
                    <li>• Rapid learning and adaptation to new technologies</li>
                    <li>• Strong problem-solving and debugging skills</li>
                    <li>• Clean, maintainable code practices</li>
                    <li>• Responsive design and cross-browser compatibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3">Professional Skills</h4>
                  <ul className="text-gray-300 print:text-gray-700 space-y-2">
                    <li>• Excellent attention to detail and quality focus</li>
                    <li>• Strong time management and organizational skills</li>
                    <li>• Customer service and client communication</li>
                    <li>• Self-motivated and independent work style</li>
                  </ul>
                </div>
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
        }
      `}</style>
    </div>
  )
}
