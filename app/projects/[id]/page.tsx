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
  role?: string
  stack?: string
  summary?: string
  challenges?: string
  background?: string
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

        {(project.role || project.stack || project.summary || project.challenges) && (
          <div className="grid md:grid-cols-2 gap-6">
            {(project.role || project.stack) && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-white">Role & Stack</h2>
                  {project.role && <p className="text-gray-300">Role: {project.role}</p>}
                  {project.stack && <p className="text-gray-300">Stack: {project.stack}</p>}
                </CardContent>
              </Card>
            )}
            {project.challenges && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-white">Challenges & Solutions</h2>
                  <p className="text-gray-300">{project.challenges}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {project.summary && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Summary</h2>
              <p className="text-gray-300">{project.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


