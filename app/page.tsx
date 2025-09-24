"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Github, ExternalLink, Mail, MapPin, Download, Code, Palette, Zap, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { ContactForm } from "@/components/contact-form"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  color: string
  status: string
}

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [projects, setProjects] = useState<Project[]>([])
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        // Fix: Handle the API response structure correctly
        setProjects(data.data?.projects || data.projects || [])
      } catch (error) {
        console.error("Failed to load projects:", error)
        // Fallback to default projects if API fails
        setProjects([
          {
            id: "dynamic-dashboard",
            title: "Dynamic Dashboard",
            description:
              "Real-time data visualization with animated charts, interactive elements, and drag-and-drop functionality. Features live notifications and responsive design.",
            image: "⚡",
            tech: ["JavaScript", "D3.js", "CSS3", "HTML5"],
            liveUrl: "/dashboard",
            githubUrl: "#",
            featured: true,
            color: "from-blue-500 to-purple-600",
            status: "Live",
          },
        ])
      }
    }

    loadProjects()
  }, [])

  const skillTags = {
    frontend: [
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "CSS3",
      "SCSS",
      "HTML5",
      "D3.js",
      "Canvas API",
    ],
    backend: ["Node.js", "Express.js", "Socket.io"],
    database: ["MongoDB", "PostgreSQL", "MySQL", "LocalStorage"],
    other: [
      "Auth / JWT / OAuth",
      "REST APIs",
      "WebSockets",
      "Stripe payments",
      "Git",
      "Figma",
      "Vercel",
      "CI/CD",
    ],
  }

  // Get featured projects for display
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 10,
            y: mousePosition.y / 10,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ left: "10%", top: "20%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x / 15,
            y: -mousePosition.y / 15,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ right: "10%", bottom: "20%" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <Link href="/" className="block">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <span className="text-xl font-bold text-white tracking-wider">IS</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="#projects" className="hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <Link href="#contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20" asChild>
              <Link href="/resume">
                <Download className="w-4 h-4 mr-2" />
                Resume
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="text-blue-400 text-lg mb-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MapPin className="w-5 h-5" />
              Colorado, USA
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Hi, I'm </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                Ian Siats
              </span>
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Creative developer crafting exceptional digital experiences with cutting-edge web technologies. I
              transform ideas into interactive, performant applications that users love.
            </motion.p>
            <motion.p
              className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              I build full-stack applications using modern JavaScript frameworks. My recent work includes interactive UIs,
              backend APIs, and deploying full-stack projects using Vercel and MongoDB.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 hover:bg-white/10"
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                View Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-80 h-80 mx-auto">
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              {/* Profile image container */}
              <div className="relative w-full h-full rounded-full border-4 border-white/20 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
                <Image
                  src="/images/ian-portrait.jpg"
                  alt="Ian Siats - Creative Developer"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 280px, 320px"
                />
                {/* Subtle overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Icons */}
              {[Code, Palette, Zap, Star].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  style={{
                    top: `${20 + index * 20}%`,
                    left: `${10 + index * 25}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3 + index,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  <Icon className="w-6 h-6 text-blue-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Passionate about creating digital experiences that not only function flawlessly but also captivate and
              inspire users through innovative design and interaction.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-white">Skills & Expertise</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Frontend</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillTags.frontend.map((t) => (
                          <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Backend</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillTags.backend.map((t) => (
                          <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Database</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillTags.database.map((t) => (
                          <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Other</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillTags.other.map((t) => (
                          <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">My Journey</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    I started with frontend fundamentals (HTML, CSS, JavaScript) and quickly moved into React and
                    Next.js to build interactive UIs. Curious about end-to-end product delivery, I learned Node.js and
                    databases to design and deploy full-stack apps.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Recent milestones include shipping an e‑commerce demo with Stripe, building an admin dashboard with
                    role-based auth, and deploying projects to Vercel with production-ready environments. I'm excited
                    to collaborate internationally and would love opportunities in Japan as well.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">∞</div>
                    <div className="text-blue-400 font-medium">Creativity</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-teal-500/20 to-green-600/20 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-teal-400 font-medium">Innovation</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              A showcase of my interactive experiences and web applications that demonstrate modern development
              practices and creative problem-solving.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div
                      className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center text-6xl relative overflow-hidden`}
                    >
                      <span className="relative z-10" role="img" aria-label={project.title}>
                        {project.image}
                      </span>
                      {project.featured && (
                        <Badge className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30 z-20">
                          Featured
                        </Badge>
                      )}

                      {/* Hover overlay that covers the entire image */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-30">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                        >
                          <Link href={project.liveUrl}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </Link>
                        </Button>
                        {project.githubUrl !== "#" && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200 border-white/30 hover:bg-white/20"
                          >
                            <Link href={project.githubUrl}>
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p><span className="text-white font-semibold">Role:</span> Full-stack developer</p>
                        <p>
                          <span className="text-white font-semibold">Stack:</span> React, Node.js, Express, MongoDB
                        </p>
                        <p>
                          <span className="text-white font-semibold">Summary:</span> Built a responsive e-commerce site with full product management. Users can sign up, add products to cart, and check out with Stripe integration.
                        </p>
                        <p>
                          <span className="text-white font-semibold">Challenges:</span> Learned secure auth, handled async data flow with React hooks, and deployed using Vercel + MongoDB Atlas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to create something amazing together? I'm always excited to discuss new opportunities and innovative
              projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Email</h4>
                        <a
                          href="mailto:iansiats9@gmail.com"
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                          iansiats9@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Location</h4>
                        <p className="text-gray-300">Colorado, USA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                        <Github className="w-6 h-6 text-teal-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">GitHub</h4>
                        <a
                          href="https://github.com/Turbo9k"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-teal-400 transition-colors"
                        >
                          github.com/Turbo9k
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center">
                        {/* LinkedIn icon substitute with Mail for consistency, or add a simple "in" */}
                        <span className="text-sky-400 font-bold">in</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">LinkedIn</h4>
                        <a
                          href="https://www.linkedin.com/in/iansiats"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-sky-400 transition-colors"
                        >
                          linkedin.com/in/iansiats
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold">X</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Twitter</h4>
                        <a
                          href="https://twitter.com/iansiats"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                          twitter.com/iansiats
                        </a>
                      </div>
                    </div>
                </CardContent>
              </Card>

              <ContactForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 Ian Siats. Crafted with passion in Colorado. • Last updated: 09/2025 • Built with Next.js & Vercel
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/Turbo9k"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                Projects
              </Link>
              <a href="mailto:iansiats9@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
