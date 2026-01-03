"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ResumeContent {
  name: string
  title: string
  email: string
  location: string
  github: string
  website: string
  professionalSummary: string
  resumeFileUrl?: string
  resumeFileName?: string
  technicalSkills: {
    frontend: string
    backend: string
    tools: string
  }
  education: {
    title: string
    period: string
    description: string
  }
}

interface ResumeEditorProps {
  content: ResumeContent
  onSave: (content: ResumeContent) => void
  onCancel: () => void
}

export function ResumeEditor({ content, onSave, onCancel }: ResumeEditorProps) {
  const [formData, setFormData] = useState<ResumeContent>(content)

  useEffect(() => {
    setFormData(content)
  }, [content])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof ResumeContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (field: "technicalSkills" | "education", subField: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Edit Resume Content</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
              <textarea
                value={formData.professionalSummary}
                onChange={(e) => handleChange("professionalSummary", e.target.value)}
                rows={6}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Technical Skills</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Frontend</label>
                  <textarea
                    value={formData.technicalSkills.frontend}
                    onChange={(e) => handleNestedChange("technicalSkills", "frontend", e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="React • Next.js • TypeScript..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Backend & Databases</label>
                  <textarea
                    value={formData.technicalSkills.backend}
                    onChange={(e) => handleNestedChange("technicalSkills", "backend", e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Node.js • Express.js • PostgreSQL..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Tools & Technologies</label>
                  <textarea
                    value={formData.technicalSkills.tools}
                    onChange={(e) => handleNestedChange("technicalSkills", "tools", e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Git • GitHub • Vercel..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Education</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.education.title}
                    onChange={(e) => handleNestedChange("education", "title", e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Period</label>
                  <input
                    type="text"
                    value={formData.education.period}
                    onChange={(e) => handleNestedChange("education", "period", e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.education.description}
                    onChange={(e) => handleNestedChange("education", "description", e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">Resume PDF File</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Resume File URL</label>
                  <input
                    type="url"
                    value={formData.resumeFileUrl || ""}
                    onChange={(e) => handleChange("resumeFileUrl", e.target.value)}
                    placeholder="https://example.com/resume.pdf or /resume.pdf"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the URL to your resume PDF file. Can be a full URL (https://...) or a relative path (/resume.pdf).
                    If left empty, defaults to /Ian_Siats_Resume.pdf
                    <br />
                    <span className="text-yellow-400">Note:</span> For Vercel deployments, upload your PDF to a cloud storage service
                    (like Vercel Blob, Cloudinary, or AWS S3) and use that URL here.
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Download File Name (optional)</label>
                  <input
                    type="text"
                    value={formData.resumeFileName || ""}
                    onChange={(e) => handleChange("resumeFileName", e.target.value)}
                    placeholder="Ian_Siats_Resume.pdf"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The filename that will be used when users download the resume. If left empty, will use the filename from the URL.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="border-white/20 hover:bg-white/10">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



