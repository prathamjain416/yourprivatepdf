"use client"

import * as React from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  onFilesChange: (files: File[]) => void
  label?: string
  description?: string
  className?: string
}

export function FileUpload({
  accept = ".pdf",
  multiple = false,
  maxFiles = 1,
  onFilesChange,
  label = "Click to upload or drag and drop",
  description = "PDF files only (Max. 50MB)",
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return

    const fileArray = Array.from(newFiles).filter(file => file && file.name)
    if (fileArray.length === 0) return

    const validFiles = multiple ? [...files, ...fileArray].slice(0, maxFiles) : fileArray.slice(0, 1)

    setFiles(validFiles)
    onFilesChange(validFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  return (
    <div className={cn("grid gap-4 w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-muted-foreground/20 hover:border-primary/50 bg-muted/30",
          files.length >= maxFiles && "opacity-50 pointer-events-none",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 rounded-full bg-background shadow-sm">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => {
            if (!file || !file.name) return null
            return (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center justify-between p-3 bg-muted/50 border rounded-lg group animate-in fade-in slide-in-from-top-1"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-background border">
                    <FileIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="grid gap-0.5">
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(i)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
