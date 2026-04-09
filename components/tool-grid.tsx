"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { FileType, Merge, Scissors, RotateCw, FileText, Search, Zap, Droplet, Image as ImageIcon, Trash2, Type, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export type ToolId =
  | "images-to-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "pdf-to-text"
  | "ocr-scan"
  | "compress-pdf"
  | "pdf-watermark"
  | "extract-images"
  | "remove-pages"
  | "text-to-pdf"

export const tools: {
  id: ToolId
  title: string
  description: string
  icon: React.ReactNode
  category: string
  tag: string
  badge?: string
}[] = [
  {
    id: "images-to-pdf",
    title: "Images to PDF",
    description: "Combine multiple images into a single PDF document.",
    icon: <FileType className="w-6 h-6" />,
    category: "Convert",
    tag: "Local",
  },
  {
    id: "merge-pdf",
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one in seconds.",
    icon: <Merge className="w-6 h-6" />,
    category: "Organize",
    tag: "Local",
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract specific pages or ranges into separate files.",
    icon: <Scissors className="w-6 h-6" />,
    category: "Organize",
    tag: "Local",
  },
  {
    id: "rotate-pdf",
    title: "Rotate Pages",
    description: "Fix incorrectly oriented PDF pages instantly.",
    icon: <RotateCw className="w-6 h-6" />,
    category: "Edit",
    tag: "Local",
  },
  {
    id: "pdf-to-text",
    title: "PDF to Text",
    description: "Extract searchable text from your PDF documents.",
    icon: <FileText className="w-6 h-6" />,
    category: "Extract",
    tag: "Worker",
  },
  {
    id: "ocr-scan",
    title: "OCR Scan",
    description: "Recognize text in scanned PDFs using local OCR.",
    icon: <Search className="w-6 h-6" />,
    category: "Extract",
    tag: "AI/ML",
    badge: "Beta",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size while maintaining quality.",
    icon: <Zap className="w-6 h-6" />,
    category: "Optimize",
    tag: "WASM",
  },
  {
    id: "pdf-watermark",
    title: "Add Watermark",
    description: "Add text watermarks to your PDF pages.",
    icon: <Droplet className="w-6 h-6" />,
    category: "Edit",
    tag: "Local",
  },
  {
    id: "extract-images",
    title: "Extract Images",
    description: "Extract all images from your PDF as PNG files.",
    icon: <ImageIcon className="w-6 h-6" />,
    category: "Extract",
    tag: "Local",
  },
  {
    id: "remove-pages",
    title: "Remove Pages",
    description: "Delete unwanted pages from your PDF.",
    icon: <Trash2 className="w-6 h-6" />,
    category: "Edit",
    tag: "Local",
  },
  {
    id: "text-to-pdf",
    title: "Text to PDF",
    description: "Convert plain text into a formatted PDF.",
    icon: <Type className="w-6 h-6" />,
    category: "Convert",
    tag: "Local",
  },
]

interface ToolGridProps {
  onSelectTool: (id: ToolId) => void
}

export function ToolGrid({ onSelectTool }: ToolGridProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools

    const query = searchQuery.toLowerCase()
    return tools.filter((tool) => {
      const matchTitle = tool.title.toLowerCase().includes(query)
      const matchDescription = tool.description.toLowerCase().includes(query)
      const matchCategory = tool.category.toLowerCase().includes(query)
      const matchTag = tool.tag.toLowerCase().includes(query)

      return matchTitle || matchDescription || matchCategory || matchTag
    })
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search tools by name, type, or function..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 bg-muted/50 border-muted-foreground/20 focus:border-primary/40"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results info */}
      {searchQuery && (
        <div className="text-center text-sm text-muted-foreground">
          Found {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Tool Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="group cursor-pointer hover:shadow-md transition-all border-muted-foreground/10 hover:border-primary/40"
              onClick={() => onSelectTool(tool.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="pt-4 text-xl">{tool.title}</CardTitle>
                <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {tool.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">• {tool.tag}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
