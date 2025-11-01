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
                <h2 className="text-xl text-blue-400 print:text-blue-600 mb-4">Full-Stack Web Developer</h2>
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
              <p className="text-gray-300 print:text-gray-700 leading-relaxed text-base">
                Self-taught Full-Stack Web Developer seeking an entry-level position to launch my professional career. 
                Through intensive self-directed learning, I have developed strong proficiency in modern web development 
                technologies including React, Next.js, TypeScript, and full-stack JavaScript development. My portfolio 
                demonstrates hands-on experience building production-ready applications with complex features such as 
                payment processing, authentication systems, and responsive user interfaces. I am a quick learner with a 
                proven ability to master new technologies independently, evidenced by my successful completion of multiple 
                full-stack projects. Eager to apply my technical skills in a professional environment where I can 
                contribute to real-world projects while continuing to grow under mentorship. Highly motivated, 
                detail-oriented, and committed to writing clean, maintainable code that follows industry best practices.
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
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3 text-sm uppercase tracking-wide">Frontend</h4>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-400 print:bg-blue-100 print:text-blue-800 border-blue-500/30 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3 text-sm uppercase tracking-wide">Backend & Databases</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Node.js",
                      "Python",
                      "PostgreSQL",
                      "MongoDB",
                      "RESTful APIs",
                      "JWT Authentication",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-400 print:bg-purple-100 print:text-purple-800 border-purple-500/30 text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3 text-sm uppercase tracking-wide">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Git/GitHub",
                      "Vercel",
                      "Stripe API",
                      "D3.js",
                      "Responsive Design",
                      "UI/UX Design",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 print:bg-green-100 print:text-green-800 border-green-500/30 text-xs"
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
              <div className="border-l-2 border-blue-500/30 pl-4 print:border-blue-600">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black text-lg">Full-Stack E-Commerce Platform</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600 font-medium">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed">
                  Developed a complete e-commerce solution from the ground up, learning and implementing secure payment 
                  processing, dynamic inventory management, and real-time order tracking. Built responsive interfaces 
                  ensuring optimal user experience across all devices. Successfully integrated Stripe API for secure 
                  transactions and PostgreSQL for robust data management, learning best practices for API integration 
                  and database design in the process.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["React", "Node.js", "PostgreSQL", "Stripe API", "RESTful APIs"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600 font-medium">
                  Live Demo: <a href="https://ecommerce-store-mu-five.vercel.app" target="_blank" rel="noopener noreferrer" className="underline">ecommerce-store-mu-five.vercel.app</a>
                </p>
              </div>

              <div className="border-l-2 border-green-500/30 pl-4 print:border-green-600">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black text-lg">Advanced Calculator Application</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600 font-medium">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed">
                  Created a feature-rich calculator application with scientific computing capabilities, calculation history 
                  tracking, and persistent storage using browser LocalStorage. This project helped me develop skills in 
                  clean, modular JavaScript architecture while focusing on code maintainability and extensibility. Designed 
                  an intuitive user interface with smooth animations and responsive design, learning frontend best practices.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["JavaScript (ES6+)", "Python", "CSS3", "LocalStorage API"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600 font-medium">
                  GitHub: <a href="https://github.com/Turbo9k/Calculator" target="_blank" rel="noopener noreferrer" className="underline">github.com/Turbo9k/Calculator</a>
                </p>
              </div>

              <div className="border-l-2 border-purple-500/30 pl-4 print:border-purple-600">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black text-lg">Enterprise Admin Dashboard</h4>
                  <span className="text-sm text-gray-400 print:text-gray-600 font-medium">2024</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed">
                  Built a comprehensive administrative dashboard, mastering JWT-based authentication and role-based access 
                  control (RBAC) concepts through hands-on implementation. Utilized Next.js 14 App Router and TypeScript to 
                  learn type-safe development practices and improve code quality. Implemented MongoDB for flexible data 
                  modeling, gaining experience with NoSQL database architecture, and designed a modern, responsive interface 
                  with Tailwind CSS.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Next.js 14", "TypeScript", "Tailwind CSS", "MongoDB", "JWT Authentication"].map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 print:border-gray-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-400 print:text-blue-600 font-medium">
                  Live Demo: <a href="https://cognivex.vercel.app" target="_blank" rel="noopener noreferrer" className="underline">cognivex.vercel.app</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Journey */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Learning Journey & Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white print:text-black text-lg">
                    Self-Directed Full-Stack Web Development Program
                  </h4>
                  <span className="text-sm text-gray-400 print:text-gray-600">2022 - Present</span>
                </div>
                <p className="text-gray-300 print:text-gray-700 mb-3 leading-relaxed">
                  Committed to continuous learning through structured self-study, online courses, and hands-on project 
                  development. This journey has taught me not just technical skills, but also the discipline and 
                  perseverance needed to overcome challenges and grow as a developer. I am actively seeking my first 
                  professional opportunity to apply these skills while learning from experienced mentors and contributing 
                  to real-world projects.
                </p>
                <ul className="text-gray-300 print:text-gray-700 space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Completed comprehensive coursework in JavaScript (ES6+), React, Next.js, Node.js, TypeScript, 
                      and modern web development frameworks through online platforms and documentation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Built and deployed multiple full-stack applications from concept to production, solving complex 
                      problems independently and learning through hands-on experience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 print:bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Actively engaged with developer communities, staying current with industry trends and best practices 
                      to continuously improve my skills
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm print:bg-white print:text-black print:border-gray-300">
            <CardHeader>
              <CardTitle className="text-white print:text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400 print:text-blue-600" />
                Core Competencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3 text-sm uppercase tracking-wide">Technical Capabilities</h4>
                  <ul className="text-gray-300 print:text-gray-700 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 print:text-blue-600 mt-1">▸</span>
                      <span>Rapid adoption of new technologies and frameworks through independent learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 print:text-blue-600 mt-1">▸</span>
                      <span>Strong analytical and problem-solving skills demonstrated through complex project development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 print:text-blue-600 mt-1">▸</span>
                      <span>Adherence to industry best practices with focus on clean, maintainable code architecture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 print:text-blue-600 mt-1">▸</span>
                      <span>Continuous improvement mindset with openness to feedback and collaborative learning</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white print:text-black mb-3 text-sm uppercase tracking-wide">Professional Attributes</h4>
                  <ul className="text-gray-300 print:text-gray-700 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 print:text-purple-600 mt-1">▸</span>
                      <span>Self-directed with proven ability to deliver projects independently and meet deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 print:text-purple-600 mt-1">▸</span>
                      <span>Meticulous attention to detail with consistent focus on quality and user experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 print:text-purple-600 mt-1">▸</span>
                      <span>Effective collaboration skills with experience contributing to shared codebases and team projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 print:text-purple-600 mt-1">▸</span>
                      <span>Adaptable professional capable of quickly integrating into new environments and workflows</span>
                    </li>
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
