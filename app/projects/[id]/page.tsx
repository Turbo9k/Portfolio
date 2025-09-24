"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"

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

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" })
        const data = await res.json()
        const list: Project[] = data.data?.projects || data.projects || []
        const current = list.find((p) => p.id === params.id)
        setProject(current || null)
      } catch {
        setProject(null)
      }
    }
    load()
  }, [params.id])

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <Link href="/projects" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Link>
          <div className="mt-8 text-gray-300">Project not found.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/projects" className="inline-flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Projects
          </Link>
          <div className="flex gap-3">
            {project.liveUrl !== "#" && (
              <Link prefetch={false} href={project.liveUrl} className="inline-flex items-center text-blue-400 hover:text-blue-300">
                <ExternalLink className="w-4 h-4 mr-1" /> Live
              </Link>
            )}
            {project.githubUrl !== "#" && (
              <Link prefetch={false} href={project.githubUrl} className="inline-flex items-center text-gray-300 hover:text-white">
                <Github className="w-4 h-4 mr-1" /> Code
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-2">
          {project.title}
        </motion.h1>
        <div className="text-gray-300 mb-6">{project.description}</div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t) => (
            <Badge key={t} className="bg-white/10 text-blue-400 border-blue-500/30">
              {t}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Role & Stack</h2>
              <p className="text-gray-300">Role: Full‑stack developer</p>
              <p className="text-gray-300">Stack: React/Next.js, Node.js, Express, MongoDB (plus per‑project extras)</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-semibold text-white">Challenges & Solutions</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Auth flows and session handling → role-based guards, secure cookies.</li>
                <li>Async data flow → React hooks, SWR patterns, API route caching.</li>
                <li>Deploy & env management → Vercel envs, logging, monitoring.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Architecture / Data Flow</h2>
            <p className="text-gray-300">
              Client (Next.js App Router) → API routes (/app/api) → Business logic → Database. Auth middleware protects
              admin and sensitive areas. Static assets served via Next Image for optimized delivery.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


