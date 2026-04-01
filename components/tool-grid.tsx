"use client"

import type React from "react"

import { FileType, Merge, Scissors, RotateCw, FileText, Search, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type ToolId =
  | "images-to-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "pdf-to-text"
  | "ocr-scan"
  | "compress-pdf"

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
]

interface ToolGridProps {
  onSelectTool: (id: ToolId) => void
}

export function ToolGrid({ onSelectTool }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool) => (
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
  )
}
