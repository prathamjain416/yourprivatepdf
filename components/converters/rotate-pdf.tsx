"use client"

import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { PDFDocument, degrees } from "pdf-lib"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Download, Loader2, FileType, RotateCw } from "lucide-react"
import { FieldGroup, Field } from "@/components/ui/field"

// Initialize pdf.js worker with dynamic version matching
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
}

export function RotatePDF() {
  const [file, setFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(90)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPages, setSelectedPages] = useState<string>("all")
  const [pageSpecifier, setPageSpecifier] = useState("")

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return

    const selectedFile = files[0]
    setFile(selectedFile)
    setError(null)
    setResult(null)

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
    if (selection === "all") {
      return Array.from({ length: total }, (_, i) => i)
    }

    const pages: number[] = []
    const parts = selection.split(",").map((p) => p.trim())

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((p) => parseInt(p.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start - 1; i < end && i < total; i++) {
            if (i >= 0) pages.push(i)
          }
        }
      } else {
        const pageNum = parseInt(part) - 1
        if (!isNaN(pageNum) && pageNum >= 0 && pageNum < total) {
          pages.push(pageNum)
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b)
  }

  const rotatePDF = async () => {
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer)
      const pages = sourcePdf.getPages()

      // Determine which pages to rotate
      const pagesToRotate = parsePageSelection(
        selectedPages === "all" ? "all" : pageSpecifier,
        pages.length
      )

      if (pagesToRotate.length === 0) {
        setError("No valid pages selected. Please check your page numbers.")
        setIsProcessing(false)
        return
      }

      // Rotate selected pages
      for (let i = 0; i < pagesToRotate.length; i++) {
        const pageIndex = pagesToRotate[i]
        const page = pages[pageIndex]
        const currentRotation = page.getRotation().angle || 0
        const newRotation = (currentRotation + rotationAngle) % 360

      page.setRotation(degrees(newRotation))

        
        setProgress(Math.round(((i + 1) / pagesToRotate.length) * 100))
      }

      const pdfBytes = await sourcePdf.save()
      setResult(pdfBytes as unknown as Uint8Array)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to rotate PDF"
      setError(errorMsg)
      console.error("[v0] Rotate PDF error:", err)
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
    a.download = `${file?.name?.replace(".pdf", "") || "rotated"}-rotated.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Rotate Pages</h3>
        <p className="text-muted-foreground">Fix incorrectly oriented PDF pages instantly.</p>
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
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Total pages: {totalPages}</p>

              <FieldGroup>
                <Field>
                  <Label className="text-sm mb-3">Rotation angle</Label>
                  <div className="flex gap-2 flex-wrap">
                    {[90, 180, 270].map((angle) => (
                      <Button
                        key={angle}
                        variant={rotationAngle === angle ? "default" : "outline"}
                        onClick={() => setRotationAngle(angle)}
                        className="flex items-center gap-2"
                      >
                        <RotateCw className="h-4 w-4" />
                        {angle}°
                      </Button>
                    ))}
                  </div>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <Label className="text-sm mb-3">Apply to</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPages === "all" ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPages("all")
                        setPageSpecifier("")
                      }}
                      size="sm"
                    >
                      All pages
                    </Button>
                    <Button
                      variant={selectedPages === "custom" ? "default" : "outline"}
                      onClick={() => setSelectedPages("custom")}
                      size="sm"
                    >
                      Custom
                    </Button>
                  </div>

                  {selectedPages === "custom" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="e.g., 1, 3-5, 7"
                        value={pageSpecifier}
                        onChange={(e) => setPageSpecifier(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter page numbers or ranges (1-indexed). Example: 1, 3-5, 7
                      </p>
                    </div>
                  )}
                </Field>
              </FieldGroup>
            </div>
          )}

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            disabled={
              !file || (selectedPages === "custom" && !pageSpecifier.trim()) || isProcessing
            }
            onClick={rotatePDF}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rotating {progress}%
              </>
            ) : (
              "Rotate Pages"
            )}
          </Button>

          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Rotation Complete!</AlertTitle>
            <AlertDescription>Your PDF pages have been successfully rotated.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFile(null)
                setResult(null)
                setTotalPages(0)
                setSelectedPages("all")
                setPageSpecifier("")
              }}
            >
              Rotate Another
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
