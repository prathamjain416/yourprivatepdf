"use client"

import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { PDFDocument } from "pdf-lib"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Download, Loader2, FileType } from "lucide-react"

// Initialize pdf.js worker with dynamic version matching
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
}

export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [pageRange, setPageRange] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get total pages from PDF
  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return

    const selectedFile = files[0]
    setFile(selectedFile)
    setError(null)
    setResult(null)
    setPageRange("")

    try {
      const fileBuffer = await selectedFile.arrayBuffer()
      const sourcePdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise
      setTotalPages(sourcePdf.numPages)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load PDF"
      setError(errorMsg)
      console.error("[v0] Failed to load PDF:", err)
    }
  }

  // Parse page range string (e.g., "1, 3-5, 7") into array of page numbers
  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const pages: number[] = []
    const parts = rangeStr.split(",").map((p) => p.trim())

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => parseInt(p.trim()))
        for (let i = start; i <= end && i <= maxPages; i++) {
          if (i > 0) pages.push(i)
        }
      } else {
        const pageNum = parseInt(part)
        if (pageNum > 0 && pageNum <= maxPages) {
          pages.push(pageNum)
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b) // Remove duplicates and sort
  }

  // Extract selected pages
  const splitPDF = async () => {
    if (!file || !pageRange.trim()) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const selectedPages = parsePageRange(pageRange, totalPages)

      if (selectedPages.length === 0) {
        setError("Please enter valid page numbers")
        setIsProcessing(false)
        return
      }

      const fileBuffer = await file.arrayBuffer()
      const sourcePdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise
      const newPdf = await PDFDocument.create()

      for (let i = 0; i < selectedPages.length; i++) {
        const pageNum = selectedPages[i]
        const page = await sourcePdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 2 })

        // Create canvas and render page
        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height

        const context = canvas.getContext("2d")
        if (!context) throw new Error("Failed to get canvas context")

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        // Convert canvas to blob for proper embedding
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png")
        })
        const imageBuffer = await blob.arrayBuffer()
        const pngImage = await newPdf.embedPng(imageBuffer)

        const pdfPage = newPdf.addPage([viewport.width / 2, viewport.height / 2])
        pdfPage.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: viewport.width / 2,
          height: viewport.height / 2,
        })

        setProgress(Math.round(((i + 1) / selectedPages.length) * 100))
      }

      const pdfBytes = await newPdf.save()
      setResult(pdfBytes as unknown as Uint8Array)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to split PDF"
      setError(errorMsg)
      console.error("[v0] Split PDF error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = () => {
    if (!result) return
    const buffer = new ArrayBuffer(result.length)
    const view = new Uint8Array(buffer)
    view.set(result)
    const blob = new Blob([buffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file?.name?.replace(".pdf", "") || "split"}-extracted.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Split PDF</h3>
        <p className="text-muted-foreground">Extract specific pages from your PDF into a new document.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <FileUpload
            accept="application/pdf"
            onFilesChange={handleFileChange}
            maxFiles={1}
            label="Upload a PDF file"
            description="Max 50MB"
          />

          {totalPages > 0 && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Total pages: {totalPages}</p>

              <div>
                <Label htmlFor="page-range" className="text-sm">
                  Enter page numbers to extract
                </Label>
                <Input
                  id="page-range"
                  placeholder="e.g., 1, 3-5, 7"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter individual pages or ranges separated by commas. Example: 1, 3-5, 7
                </p>
              </div>
            </div>
          )}

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={!file || !pageRange.trim() || isProcessing} onClick={splitPDF}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting {progress}%
              </>
            ) : (
              "Extract Pages"
            )}
          </Button>

          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Extraction Complete!</AlertTitle>
            <AlertDescription>Your pages have been successfully extracted into a new PDF.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFile(null)
                setPageRange("")
                setResult(null)
                setTotalPages(0)
              }}
            >
              Split Another
            </Button>
            <Button className="flex-1" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
