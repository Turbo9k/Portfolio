"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"

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

interface ProjectFormProps {
  project?: Project
  onSave: (project: Project) => void
  onCancel: () => void
}

const colorOptions = [
  "from-blue-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600",
  "from-green-500 to-teal-600",
  "from-indigo-500 to-blue-600",
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-pink-600",
  "from-yellow-500 to-orange-600",
  "from-teal-500 to-green-600",
  "from-red-500 to-pink-600",
]

const statusOptions = ["Live", "In Development", "Planning", "Archived"]

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>({
    id: "",
    title: "",
    description: "",
    image: "🚀",
    tech: [],
    liveUrl: "",
    githubUrl: "",
    featured: false,
    color: colorOptions[0],
    status: "Planning",
  })
  const [newTech, setNewTech] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (project) {
      setFormData(project)
    } else {
      // Generate ID for new project
      setFormData((prev) => ({
        ...prev,
        id: `project-${Date.now()}`,
      }))
    }
  }, [project])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.image.trim()) newErrors.image = "Image/emoji is required"
    if (formData.tech.length === 0) newErrors.tech = "At least one technology is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
      handleInputChange("tech", [...formData.tech, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTechnology = (techToRemove: string) => {
    handleInputChange(
      "tech",
      formData.tech.filter((tech) => tech !== techToRemove),
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">{project ? "Edit Project" : "Add New Project"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.title ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
                    errors.description ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="Describe your project..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>

              {/* Image/Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image/Emoji *</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.image ? "border-red-400" : "border-white/20"
                  }`}
                  placeholder="🚀 (emoji or image URL)"
                />
                {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                <div className="mt-2 text-center">
                  <span className="text-4xl">{formData.image}</span>
                </div>
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add technology (e.g., React, Node.js)"
                  />
                  <Button type="button" onClick={addTechnology} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1"
                    >
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)} className="ml-1 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {errors.tech && <p className="mt-1 text-sm text-red-400">{errors.tech}</p>}
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange("color", color)}
                      className={`h-12 rounded-lg bg-gradient-to-r ${color} border-2 transition-all ${
                        formData.color === color ? "border-white scale-105" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Status and Featured */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="bg-slate-800">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange("featured", e.target.checked)}
                      className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-400"
                    />
                    <span className="text-gray-300">Featured Project</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {project ? "Update Project" : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
