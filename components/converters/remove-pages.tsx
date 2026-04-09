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

export function RemovePages() {
  const [file, setFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [pagesToRemove, setPageToRemove] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return

    const selectedFile = files[0]
    setFile(selectedFile)
    setError(null)
    setResult(null)
    setPageToRemove("")

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      setTotalPages(pdf.numPages)
    } catch (err) {
      setError("Failed to load PDF. Please check the file and try again.")
      setFile(null)
      setTotalPages(0)
    }
  }

  const parsePageSelection = (selection: string, total: number): number[] => {
    const pages: number[] = []
    const parts = selection.split(",").map((p) => p.trim())

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => parseInt(p.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end && i <= total; i++) {
            if (i > 0) pages.push(i)
          }
        }
      } else {
        const pageNum = parseInt(part)
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= total) {
          pages.push(pageNum)
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b)
  }

  const removePages = async () => {
    if (!file || !pagesToRemove.trim()) {
      setError("Please select a PDF and enter page numbers to remove")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const selectedPages = parsePageSelection(pagesToRemove, totalPages)

      if (selectedPages.length === 0) {
        setError("Invalid page numbers. Please enter valid pages (e.g., '1, 3-5, 7')")
        setIsProcessing(false)
        return
      }

      if (selectedPages.length >= totalPages) {
        setError("Cannot remove all pages. At least one page must remain.")
        setIsProcessing(false)
        return
      }

      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Remove pages in reverse order to maintain indices
      for (let i = selectedPages.length - 1; i >= 0; i--) {
        const pageIndex = selectedPages[i] - 1 // Convert to 0-based index
        pdfDoc.removePage(pageIndex)
        setProgress(Math.round(((selectedPages.length - i) / selectedPages.length) * 100))
      }

      const pdfBytes = await pdfDoc.save()
      setResult(pdfBytes)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to remove pages"
      setError(errorMsg)
      console.error("[v0] Remove pages error:", err)
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
    a.download = `${file?.name?.replace(".pdf", "") || "edited"}-removed.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Remove Pages</h3>
        <p className="text-muted-foreground">Remove unwanted pages from your PDF document.</p>
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
                <Label htmlFor="pages-to-remove" className="text-sm">
                  Pages to remove
                </Label>
                <Input
                  id="pages-to-remove"
                  placeholder="e.g., 1, 3-5, 7"
                  value={pagesToRemove}
                  onChange={(e) => setPageToRemove(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter pages or ranges to remove. Example: 1, 3-5, 7
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

          <Button className="w-full" disabled={!file || !pagesToRemove.trim() || isProcessing} onClick={removePages}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing {progress}%
              </>
            ) : (
              "Remove Pages"
            )}
          </Button>

          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Pages Removed!</AlertTitle>
            <AlertDescription>Your pages have been successfully removed from the PDF.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFile(null)
                setPageToRemove("")
                setResult(null)
                setTotalPages(0)
              }}
            >
              Remove More
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
