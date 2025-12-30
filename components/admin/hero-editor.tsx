"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface HeroContent {
  name: string
  greeting: string
  title: string
  subtitle: string
  availability: string
  primaryButton: string
  secondaryButton: string
}

interface HeroEditorProps {
  content: HeroContent
  onSave: (content: HeroContent) => void
  onCancel: () => void
}

export function HeroEditor({ content, onSave, onCancel }: HeroEditorProps) {
  const [formData, setFormData] = useState<HeroContent>(content)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData(content)
  }, [content])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleChange = (field: keyof HeroContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-900 border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Edit Hero Section</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Greeting *</label>
              <input
                type="text"
                value={formData.greeting}
                onChange={(e) => handleChange("greeting", e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Hi, I'm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full p-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.name ? "border-red-400" : "border-white/20"
                }`}
                placeholder="Your Name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title/Description *</label>
              <textarea
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                rows={3}
                className={`w-full p-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
                  errors.title ? "border-red-400" : "border-white/20"
                }`}
                placeholder="Main description..."
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                rows={2}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Additional description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Availability Text</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Open to relocation and remote opportunities worldwide."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.primaryButton}
                  onChange={(e) => handleChange("primaryButton", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Get In Touch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.secondaryButton}
                  onChange={(e) => handleChange("secondaryButton", e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="View Projects"
                />
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

