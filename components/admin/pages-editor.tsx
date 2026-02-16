"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ExternalLink, Save, X, FileText, PenLine, Search, Settings } from "lucide-react"
import type { CustomPage } from "@/lib/types"

const META_DESC_MAX = 160

interface PagesEditorProps {
  pages: CustomPage[]
  onSave: (pages: CustomPage[]) => void | Promise<boolean>
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

  const [saving, setSaving] = useState(false)
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const result = await Promise.resolve(onSave(pages))
      if (result !== false) onClose()
    } finally {
      setSaving(false)
    }
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
          <Button onClick={handleSaveAll} className="bg-green-500 hover:bg-green-600" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save All"}
          </Button>
          <Button variant="outline" onClick={onClose} className="border-white/20">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {showForm && editingPage && (
        <div className="max-w-[1000px] mx-auto">
          <div className="text-white font-semibold text-lg mb-6">
            {editingPage.id.startsWith("page-") && !pages.find((p) => p.id === editingPage.id) ? "Add New Page" : "Edit Page"}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* Left column: Basics + Content */}
            <div className="space-y-6">
              {/* Page Basics */}
              <Card className="bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Page Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[15px] font-medium text-gray-200">Page Title *</Label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
                      placeholder="e.g. Website Upgrades & Maintenance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[15px] font-medium text-gray-200">Slug *</Label>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-mono text-sm"
                      placeholder="website-upgrades"
                    />
                    <p className="text-xs text-gray-500">
                      URL format: lowercase letters, numbers, and hyphens only. Live URL: <span className="text-gray-400 font-mono">/pages/{editingPage.slug || "your-slug"}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                    <PenLine className="w-4 h-4 text-blue-400" />
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label className="text-[15px] font-medium text-gray-200">Page content *</Label>
                    <textarea
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      rows={16}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-mono text-sm min-h-[320px] resize-y"
                      placeholder="Enter content (HTML and Markdown supported)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column: SEO + Visibility */}
            <div className="space-y-6 lg:pt-0">
              {/* SEO Settings */}
              <Card className="bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                    <Search className="w-4 h-4 text-blue-400" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[15px] font-medium text-gray-200">Meta Description</Label>
                    <textarea
                      value={editingPage.metaDescription || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value.slice(0, META_DESC_MAX) })}
                      rows={3}
                      maxLength={META_DESC_MAX}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-y"
                      placeholder="Short description for search results"
                    />
                    <p className="text-xs text-gray-500">
                      {(editingPage.metaDescription || "").length}/{META_DESC_MAX} characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[15px] font-medium text-gray-200">Meta Keywords</Label>
                    <input
                      type="text"
                      value={editingPage.metaKeywords || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, metaKeywords: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Visibility & Display */}
              <Card className="bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                    <Settings className="w-4 h-4 text-blue-400" />
                    Visibility & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="published" className="text-[15px] font-medium text-gray-200 cursor-pointer flex-1">
                      Published
                    </Label>
                    <Switch
                      id="published"
                      checked={editingPage.published}
                      onCheckedChange={(checked) => setEditingPage({ ...editingPage, published: checked })}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 -mt-3">Visible on the live site when on</p>

                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="showInNav" className="text-[15px] font-medium text-gray-200 cursor-pointer flex-1">
                      Show in navigation bar
                    </Label>
                    <Switch
                      id="showInNav"
                      checked={editingPage.showInNav ?? false}
                      onCheckedChange={(checked) => setEditingPage({ ...editingPage, showInNav: checked })}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  {editingPage.showInNav && (
                    <div className="space-y-2 -mt-2">
                      <Label className="text-sm font-medium text-gray-300">Nav label (optional)</Label>
                      <input
                        type="text"
                        value={editingPage.navLabel ?? ""}
                        onChange={(e) => setEditingPage({ ...editingPage, navLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="e.g. Website Upgrades"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="showContactForm" className="text-[15px] font-medium text-gray-200 cursor-pointer flex-1">
                      Show &quot;Contact me&quot; section
                    </Label>
                    <Switch
                      id="showContactForm"
                      checked={editingPage.showContactForm ?? false}
                      onCheckedChange={(checked) => setEditingPage({ ...editingPage, showContactForm: checked })}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 -mt-3">Adds a contact CTA at the bottom of the page</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={handleCancel} className="border-white/20 text-gray-300 hover:bg-white/10 order-2 sm:order-1">
              Cancel
            </Button>
            <Button onClick={handleSavePage} className="bg-blue-600 hover:bg-blue-700 text-white font-medium order-1 sm:order-2">
              <Save className="w-4 h-4 mr-2" />
              Save Page
            </Button>
          </div>
        </div>
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
