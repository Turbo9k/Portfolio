"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"

interface AboutContent {
  title: string
  subtitle: string
  journeyTitle: string
  journeyParagraph1: string
  journeyParagraph2: string
  skills: {
    frontend: string[]
    backend: string[]
    database: string[]
    other: string[]
  }
}

interface AboutEditorProps {
  content: AboutContent
  onSave: (content: AboutContent) => void
  onCancel: () => void
}

export function AboutEditor({ content, onSave, onCancel }: AboutEditorProps) {
  const [formData, setFormData] = useState<AboutContent>(content)
  const [newSkill, setNewSkill] = useState({ category: "frontend", value: "" })

  useEffect(() => {
    setFormData(content)
  }, [content])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof AboutContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.value.trim() && !formData.skills[newSkill.category as keyof typeof formData.skills].includes(newSkill.value.trim())) {
      handleChange("skills", {
        ...formData.skills,
        [newSkill.category]: [...formData.skills[newSkill.category as keyof typeof formData.skills], newSkill.value.trim()],
      })
      setNewSkill({ ...newSkill, value: "" })
    }
  }

  const removeSkill = (category: keyof typeof formData.skills, skill: string) => {
    handleChange("skills", {
      ...formData.skills,
      [category]: formData.skills[category].filter((s) => s !== skill),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Edit About Section</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                rows={2}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Journey Title</label>
              <input
                type="text"
                value={formData.journeyTitle}
                onChange={(e) => handleChange("journeyTitle", e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Journey Paragraph 1</label>
              <textarea
                value={formData.journeyParagraph1}
                onChange={(e) => handleChange("journeyParagraph1", e.target.value)}
                rows={3}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Journey Paragraph 2</label>
              <textarea
                value={formData.journeyParagraph2}
                onChange={(e) => handleChange("journeyParagraph2", e.target.value)}
                rows={3}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* Skills Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Skills</label>
              
              {/* Add Skill */}
              <div className="flex gap-2 mb-4">
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="frontend" className="bg-slate-800">Frontend</option>
                  <option value="backend" className="bg-slate-800">Backend</option>
                  <option value="database" className="bg-slate-800">Database</option>
                  <option value="other" className="bg-slate-800">Other</option>
                </select>
                <input
                  type="text"
                  value={newSkill.value}
                  onChange={(e) => setNewSkill({ ...newSkill, value: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Add skill..."
                />
                <Button type="button" onClick={addSkill} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Skills Display */}
              {(["frontend", "backend", "database", "other"] as const).map((category) => (
                <div key={category} className="mb-4">
                  <h4 className="text-white font-semibold mb-2 capitalize">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills[category].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(category, skill)}
                          className="ml-1 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
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

