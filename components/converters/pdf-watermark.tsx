"use client"

import React, { useState } from "react"
import { PDFDocument, rgb, degrees } from "pdf-lib"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Download, Loader2, FileType } from "lucide-react"

export function PDFWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [opacity, setOpacity] = useState(0.3)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (files: File[]) => {
    if (files.length === 0) return
    setFile(files[0])
    setError(null)
    setResult(null)
  }

  const addWatermark = async () => {
    if (!file || !watermarkText.trim()) {
      setError("Please select a PDF and enter watermark text")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const { width, height } = page.getSize()

        // Add watermark text diagonally across the page
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 60,
          rotate: degrees(45),
          opacity: opacity,
          color: rgb(0.8, 0.8, 0.8),
        })

        setProgress(Math.round(((i + 1) / pages.length) * 100))
      }

      const pdfBytes = await pdfDoc.save()
      setResult(pdfBytes)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add watermark"
      setError(errorMsg)
      console.error("[v0] Watermark error:", err)
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
    a.download = `${file?.name?.replace(".pdf", "") || "watermarked"}-watermarked.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Add Watermark</h3>
        <p className="text-muted-foreground">Add text watermarks to your PDF pages for confidentiality or branding.</p>
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

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="watermark-text" className="text-sm">
                Watermark text
              </Label>
              <Input
                id="watermark-text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g., CONFIDENTIAL, DRAFT"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="opacity" className="text-sm">
                Opacity: {Math.round(opacity * 100)}%
              </Label>
              <input
                id="opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={!file || !watermarkText.trim() || isProcessing} onClick={addWatermark}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Watermark {progress}%
              </>
            ) : (
              "Add Watermark"
            )}
          </Button>

          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Watermark Added!</AlertTitle>
            <AlertDescription>Your watermark has been successfully added to all pages.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setFile(null)
                setResult(null)
                setWatermarkText("CONFIDENTIAL")
                setOpacity(0.3)
              }}
            >
              Add Another
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
