"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Github, ExternalLink, Mail, MapPin, Download, Code, Palette, Zap, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
const AboutSection = dynamic(() => import("@/components/home/AboutSection"), { ssr: false })
const MobileNav = dynamic(() => import("@/components/mobile-nav").then(m => m.MobileNav), { ssr: false })
const ContactForm = dynamic(() => import("@/components/contact-form").then(m => m.ContactForm), { ssr: false })

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
  const [heroContent, setHeroContent] = useState<any>(null)
  const [aboutContent, setAboutContent] = useState<any>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [projectsVisible, setProjectsVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const projectsRef = (typeof document !== "undefined" ? (document.getElementById("projects-section") as HTMLElement | null) : null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const set = () => setReducedMotion(media.matches)
    set()
    media.addEventListener?.("change", set)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    onResize()
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      media.removeEventListener?.("change", set)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    const updateMousePosition = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setMousePosition({ x: e.clientX, y: e.clientY }))
    }
    window.addEventListener("mousemove", updateMousePosition, { passive: true })
    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion])

  // Warm up lazily-loaded components during idle to avoid INP spikes on first interaction
  useEffect(() => {
    const warm = () => {
      // Trigger the dynamic imports
      import("@/components/mobile-nav").then(() => {}).catch(() => {})
      import("@/components/contact-form").then(() => {}).catch(() => {})
    }
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(warm, { timeout: 2000 })
    } else {
      const t = setTimeout(warm, 1200)
      return () => clearTimeout(t)
    }
    return undefined
  }, [])

  useEffect(() => {
    const load = () => {
      ;(async () => {
        try {
          const [projectsRes, contentRes] = await Promise.all([
            fetch("/api/projects"),
            fetch("/api/content")
          ])
          const projectsData = await projectsRes.json()
          const contentData = await contentRes.json()
          setProjects(projectsData.data?.projects || projectsData.projects || [])
          if (contentData.data || contentData) {
            const content = contentData.data || contentData
            setHeroContent(content.hero)
            setAboutContent(content.about)
          }
        } catch (error) {
          console.error("Failed to load data:", error)
        }
      })()
    }
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(load, { timeout: 1500 })
    } else {
      setTimeout(load, 800)
    }
  }, [])

  // Defer rendering of sections until in view
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setProjectsVisible(true)
      setAboutVisible(true)
      setContactVisible(true)
      return
    }
    
    const sections = [
      { id: "projects-section", setter: setProjectsVisible },
      { id: "about-section", setter: setAboutVisible },
      { id: "contact", setter: setContactVisible }
    ]
    
    const observers = sections.map(({ id, setter }) => {
      const section = document.getElementById(id)
      if (!section) return null
      
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setter(true)
              io.disconnect()
            }
          })
        },
        { rootMargin: "200px" },
      )
      io.observe(section)
      return io
    }).filter(Boolean)
    
    return () => observers.forEach(io => io?.disconnect())
  }, [])

  const skillTags = aboutContent?.skills || {
    frontend: ["React", "Next.js", "CSS/SCSS", "TypeScript"],
    backend: ["Node.js", "Express"],
    database: ["MongoDB"],
    other: ["Git", "Figma", "Vercel", "REST APIs"],
  }

  // Get featured projects for display
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden w-full">
      {/* Animated Background */}
      {!reducedMotion && !isMobile && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)]" />
          <motion.div
            className="absolute hidden lg:block w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{ x: mousePosition.x / 10, y: mousePosition.y / 10 }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
            style={{ left: "10%", top: "20%" }}
          />
          <motion.div
            className="absolute hidden lg:block w-80 h-80 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-full blur-3xl"
            animate={{ x: -mousePosition.x / 15, y: -mousePosition.y / 15 }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
            style={{ right: "10%", bottom: "20%" }}
          />
        </div>
      )}

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center w-full">
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
            <Link href="#about" className="hover:text-blue-400 transition-colors" prefetch={false}>
              About
            </Link>
            <Link prefetch={false} href="/projects" className="hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <Link 
              prefetch={false} 
              href="#contact" 
              className="hover:text-blue-400 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setContactVisible(true)
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }}
            >
              Contact
            </Link>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20" asChild>
              <Link prefetch={false} href="/resume">
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
      <section className="min-h-screen flex items-center justify-center relative pt-20 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 break-words"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">{heroContent?.greeting || "Hi, I'm "} </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                {heroContent?.name || "Ian Siats"}
              </span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed break-words"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {heroContent?.title || "Creative developer crafting exceptional digital experiences with cutting-edge web technologies. I transform ideas into interactive, performant applications that users love."}
            </motion.p>
            {heroContent?.subtitle && (
              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 leading-relaxed break-words"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {heroContent.subtitle}
              </motion.p>
            )}
            {heroContent?.availability && (
              <motion.p
                className="text-sm sm:text-base text-gray-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {heroContent.availability}
              </motion.p>
            )}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
            <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
                onClick={() => {
                  setContactVisible(true)
                  setTimeout(() => {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }}
              >
                <Mail className="w-5 h-5 mr-2" />
                {heroContent?.primaryButton || "Get In Touch"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 hover:bg-white/10 w-full sm:w-auto"
                onClick={() => {
                  document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                {heroContent?.secondaryButton || "View Projects"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
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

              {/* Floating Icons - Reduced for mobile */}
              {(isMobile ? [Code] : [Code, Star]).map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  style={{
                    top: `${25 + index * 30}%`,
                    left: `${15 + index * 30}%`,
                  }}
                  animate={reducedMotion ? {} : {
                    y: [0, -8, 0],
                    rotate: [0, 180],
                  }}
                  transition={reducedMotion ? {} : {
                    duration: 4 + index,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                >
                  <Icon className="w-5 h-5 text-blue-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Dynamically imported and gated */}
      <div id="about-section">
        {aboutVisible && aboutContent && <AboutSection skillTags={skillTags} aboutContent={aboutContent} />}
      </div>

      {/* Projects Section */}
      <section id="projects-section" className="py-20 relative" aria-label="Featured Projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
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

          {projectsVisible && (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
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
                      className={`h-40 sm:h-48 bg-gradient-to-br ${project.color} flex items-center justify-center text-4xl sm:text-6xl relative overflow-hidden`}
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
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 z-30 p-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 w-full sm:w-auto"
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
                            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200 border-white/30 hover:bg-white/20 w-full sm:w-auto"
                          >
                            <Link href={project.githubUrl}>
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 break-words">{project.title}</h3>
                      <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed break-words">{project.description}</p>
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
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link prefetch={false} href="/projects">
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Gated */}
      {contactVisible && (
        <section id="contact" className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
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
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 w-full">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm w-full">
                  <CardContent className="p-4 sm:p-6 md:p-8">
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
                    </div>
                  </CardContent>
                </Card>

                <ContactForm />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 Ian Siats. Crafted with passion in Colorado.
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
              <Link href="/projects" className="text-gray-400 hover:text-white transition-colors" prefetch={false}>
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
