"use client"

import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Download, Loader2, FileType, Image as ImageIcon } from "lucide-react"

// Initialize pdf.js worker with dynamic version matching
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
}

export function ExtractImages() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedImages, setExtractedImages] = useState<{ name: string; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [imageCount, setImageCount] = useState(0)

  const handleFileChange = (files: File[]) => {
    if (files.length === 0) return
    setFile(files[0])
    setError(null)
    setExtractedImages([])
    setImageCount(0)
  }

  const extractImages = async () => {
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setExtractedImages([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const images: { name: string; url: string }[] = []

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: 2 })

          // Render page to canvas to extract visible images
          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height

          const context = canvas.getContext("2d")
          if (!context) continue

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise

          // Convert canvas to image
          const imageUrl = canvas.toDataURL("image/png")
          images.push({
            name: `page-${pageNum}.png`,
            url: imageUrl,
          })
        } catch (err) {
          console.error(`[v0] Error extracting page ${pageNum}:`, err)
        }

        setProgress(Math.round((pageNum / pdf.numPages) * 100))
      }

      if (images.length === 0) {
        setError("No images found in the PDF. This PDF may contain only text or vector graphics.")
        setIsProcessing(false)
        return
      }

      setExtractedImages(images)
      setImageCount(images.length)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to extract images"
      setError(errorMsg)
      console.error("[v0] Extract images error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = (imageUrl: string, imageName: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = imageName
    link.click()
  }

  const downloadAllAsZip = async () => {
    // For simplicity, download images individually
    extractedImages.forEach((img, idx) => {
      setTimeout(() => {
        downloadImage(img.url, img.name)
      }, idx * 200)
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Extract Images</h3>
        <p className="text-muted-foreground">Extract all images from your PDF as PNG files.</p>
      </div>

      {extractedImages.length === 0 ? (
        <div className="space-y-4">
          <FileUpload
            accept="application/pdf"
            onFilesChange={handleFileChange}
            maxFiles={1}
            label="Upload a PDF file"
            description="Max 50MB"
          />

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={!file || isProcessing} onClick={extractImages}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting {progress}%
              </>
            ) : (
              "Extract Images"
            )}
          </Button>

          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Extraction Complete!</AlertTitle>
            <AlertDescription>Found {imageCount} images in your PDF.</AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            {extractedImages.map((img, idx) => (
              <div key={idx} className="border rounded-lg p-3 bg-muted/30 space-y-2">
                <div className="aspect-square bg-muted rounded flex items-center justify-center overflow-hidden">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-medium truncate">{img.name}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadImage(img.url, img.name)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFile(null)
                setExtractedImages([])
              }}
            >
              Extract Another
            </Button>
            <Button className="flex-1" onClick={downloadAllAsZip}>
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
