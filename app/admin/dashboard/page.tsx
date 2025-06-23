"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  LogOut,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Github,
  Filter,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/admin/project-form"
import { QuickAddProjects } from "@/components/admin/quick-add-projects"

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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("admin-authenticated")
    if (!auth) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)
    loadProjects()
  }, [router])

  useEffect(() => {
    // Filter projects based on search and status
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tech.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Failed to load projects:", error)
      showMessage("error", "Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      })

      if (!response.ok) throw new Error("Failed to save projects")
      showMessage("success", "Projects saved successfully!")
      return true
    } catch (error) {
      console.error("Failed to save projects:", error)
      showMessage("error", "Failed to save projects")
      return false
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated")
    router.push("/admin/login")
  }

  const handleAddProject = () => {
    setEditingProject(undefined)
    setShowForm(true)
  }

  const handleQuickAddProject = async (project: Project) => {
    const updatedProjects = [...projects, project]
    const success = await saveProjects(updatedProjects)
    if (success) {
      setProjects(updatedProjects)
      showMessage("success", `${project.title} added successfully!`)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleSaveProject = async (project: Project) => {
    let updatedProjects: Project[]

    if (editingProject) {
      // Update existing project
      updatedProjects = projects.map((p) => (p.id === project.id ? project : p))
    } else {
      // Add new project
      updatedProjects = [...projects, project]
    }

    const success = await saveProjects(updatedProjects)
    if (success) {
      setProjects(updatedProjects)
      setShowForm(false)
      setEditingProject(undefined)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    const projectToDelete = projects.find((p) => p.id === projectId)
    if (!confirm(`Are you sure you want to delete "${projectToDelete?.title}"?`)) return

    const updatedProjects = projects.filter((p) => p.id !== projectId)
    const success = await saveProjects(updatedProjects)
    if (success) {
      setProjects(updatedProjects)
      showMessage("success", "Project deleted successfully!")
    }
  }

  const toggleFeatured = async (projectId: string) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, featured: !project.featured } : project,
    )
    const success = await saveProjects(updatedProjects)
    if (success) {
      setProjects(updatedProjects)
    }
  }

  const duplicateProject = async (project: Project) => {
    const duplicatedProject = {
      ...project,
      id: `${project.id}-copy-${Date.now()}`,
      title: `${project.title} (Copy)`,
      featured: false,
    }
    const updatedProjects = [...projects, duplicatedProject]
    const success = await saveProjects(updatedProjects)
    if (success) {
      setProjects(updatedProjects)
      showMessage("success", "Project duplicated successfully!")
    }
  }

  const statusOptions = ["All", "Live", "In Development", "Planning", "Archived"]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={loadProjects}
              disabled={isLoading}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleAddProject}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-40"
          >
            <div
              className={`p-4 rounded-lg border flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-red-500/20 border-red-500/30 text-red-400"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
                <div className="text-gray-400">Total Projects</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{projects.filter((p) => p.featured).length}</div>
                <div className="text-gray-400">Featured</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {projects.filter((p) => p.status === "Live").length}
                </div>
                <div className="text-gray-400">Live</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {projects.filter((p) => p.status === "In Development").length}
                </div>
                <div className="text-gray-400">In Dev</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Projects */}
        <div className="mb-8">
          <QuickAddProjects onAddProject={handleQuickAddProject} existingProjects={projects} />
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-slate-800">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Management */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Manage Projects</CardTitle>
              <div className="text-sm text-gray-400">
                {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== "All" && ` with status "${statusFilter}"`}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-400">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  {projects.length === 0 ? "No projects found" : "No projects match your search criteria"}
                </p>
                {projects.length === 0 ? (
                  <Button onClick={handleAddProject} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("All")
                    }}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{project.image}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge
                              className={`${
                                project.status === "Live"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : project.status === "In Development"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : project.status === "Planning"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              }`}
                            >
                              {project.status}
                            </Badge>
                            {project.featured && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Featured</Badge>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {project.tech.slice(0, 3).map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs border-white/20 text-gray-300">
                                  {tech}
                                </Badge>
                              ))}
                              {project.tech.length > 3 && (
                                <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                                  +{project.tech.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(project.id)}
                          className="border-white/20 hover:bg-white/10 text-xs"
                        >
                          {project.featured ? "Unfeature" : "Feature"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateProject(project)}
                          className="border-white/20 hover:bg-white/10"
                          title="Duplicate project"
                        >
                          <Save className="w-4 h-4" />
                        </Button>

                        {project.liveUrl && project.liveUrl !== "#" && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-white/20 hover:bg-white/10"
                            title="View live project"
                          >
                            <Link href={project.liveUrl} target="_blank">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}

                        {project.githubUrl && project.githubUrl !== "#" && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-white/20 hover:bg-white/10"
                            title="View GitHub repository"
                          >
                            <Link href={project.githubUrl} target="_blank">
                              <Github className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Manage your portfolio projects with full CRUD operations. Changes are saved automatically.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={loadProjects}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Projects
            </Button>
            <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={handleAddProject}>
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => {
              setShowForm(false)
              setEditingProject(undefined)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
