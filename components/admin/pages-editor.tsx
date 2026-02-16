"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Save, X } from "lucide-react"
import type { CustomPage } from "@/lib/types"

interface PagesEditorProps {
  pages: CustomPage[]
  onSave: (pages: CustomPage[]) => void
  onClose: () => void
}

export function PagesEditor({ pages: initialPages, onSave, onClose }: PagesEditorProps) {
  const [pages, setPages] = useState<CustomPage[]>(initialPages)
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleAddPage = () => {
    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      title: "",
      slug: "",
      content: "",
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metaDescription: "",
      metaKeywords: "",
      showInNav: false,
      navLabel: "",
      showContactForm: false,
    }
    setEditingPage(newPage)
    setShowForm(true)
  }

  const handleEditPage = (page: CustomPage) => {
    setEditingPage({ ...page })
    setShowForm(true)
  }

  const handleDeletePage = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      setPages(pages.filter((p) => p.id !== id))
    }
  }

  const handleSavePage = () => {
    if (!editingPage) return

    if (!editingPage.title || !editingPage.slug || !editingPage.content) {
      alert("Please fill in title, slug, and content")
      return
    }

    // Validate slug format (lowercase, no spaces, alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(editingPage.slug)) {
      alert("Slug must be lowercase, contain only letters, numbers, and hyphens, with no spaces")
      return
    }

    // Check for duplicate slugs
    const duplicateSlug = pages.find(
      (p) => p.slug === editingPage.slug && p.id !== editingPage.id
    )
    if (duplicateSlug) {
      alert("A page with this slug already exists")
      return
    }

    const updatedPages = editingPage.id.startsWith("page-") && !pages.find((p) => p.id === editingPage.id)
      ? [...pages, { ...editingPage, updatedAt: new Date().toISOString() }]
      : pages.map((p) => (p.id === editingPage.id ? { ...editingPage, updatedAt: new Date().toISOString() } : p))

    setPages(updatedPages)
    setShowForm(false)
    setEditingPage(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPage(null)
  }

  const handleSaveAll = () => {
    onSave(pages)
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Manage Pages</h2>
        <div className="flex gap-2">
          <Button onClick={handleAddPage} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
          <Button onClick={handleSaveAll} className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
          <Button variant="outline" onClick={onClose} className="border-white/20">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {showForm && editingPage && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">{editingPage.id.startsWith("page-") && !pages.find((p) => p.id === editingPage.id) ? "Add New Page" : "Edit Page"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Page Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
              <input
                type="text"
                value={editingPage.slug}
                onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="page-slug (lowercase, no spaces)"
              />
              <p className="mt-1 text-xs text-gray-400">URL: /pages/{editingPage.slug || "page-slug"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
              <textarea
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
                placeholder="Enter page content (supports HTML and Markdown)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
              <input
                type="text"
                value={editingPage.metaDescription || ""}
                onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="SEO meta description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meta Keywords</label>
              <input
                type="text"
                value={editingPage.metaKeywords || ""}
                onChange={(e) => setEditingPage({ ...editingPage, metaKeywords: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={editingPage.published}
                onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm text-gray-300">
                Published (visible on website)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInNav"
                checked={editingPage.showInNav ?? false}
                onChange={(e) => setEditingPage({ ...editingPage, showInNav: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="showInNav" className="text-sm text-gray-300">
                Show in navigation bar
              </label>
            </div>
            {editingPage.showInNav && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nav label (optional)</label>
                <input
                  type="text"
                  value={editingPage.navLabel ?? ""}
                  onChange={(e) => setEditingPage({ ...editingPage, navLabel: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. Website Upgrades"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showContactForm"
                checked={editingPage.showContactForm ?? false}
                onChange={(e) => setEditingPage({ ...editingPage, showContactForm: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="showContactForm" className="text-sm text-gray-300">
                Show &quot;Contact me&quot; section on this page
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSavePage} className="bg-green-500 hover:bg-green-600">
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </Button>
              <Button variant="outline" onClick={handleCancel} className="border-white/20">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-white text-lg">{page.title || "Untitled Page"}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPage(page)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={page.published ? "default" : "secondary"}>
                    {page.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">Slug: /pages/{page.slug}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{page.content.substring(0, 100)}...</p>
                <a
                  href={`/pages/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Page
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && !showForm && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No pages yet. Create your first page!</p>
            <Button onClick={handleAddPage} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
