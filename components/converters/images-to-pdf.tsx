"use client"

import * as React from "react"
import { FileType, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PDFDocument } from "pdf-lib"

export function ImagesToPDF() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<Uint8Array | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [statusMessage, setStatusMessage] = React.useState<string>("")

  const processImages = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)
    setError(null)
    setStatusMessage("")

    try {
      const pdfDoc = await PDFDocument.create()
      let successCount = 0
      let skipCount = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setStatusMessage(`Processing image ${i + 1} of ${files.length}...`)

        try {
          const arrayBuffer = await file.arrayBuffer()
          let image

          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await pdfDoc.embedJpg(arrayBuffer)
          } else if (file.type === "image/png") {
            image = await pdfDoc.embedPng(arrayBuffer)
          } else {
            skipCount++
            setProgress(Math.round(((i + 1) / files.length) * 100))
            continue
          }

          const page = pdfDoc.addPage([image.width, image.height])
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          })

          successCount++
          setProgress(Math.round(((i + 1) / files.length) * 100))
        } catch (err) {
          skipCount++
          setProgress(Math.round(((i + 1) / files.length) * 100))
          console.error(`Failed to process ${file.name}:`, err)
        }
      }

      if (successCount === 0) {
        setError("No valid images were processed. Please check your file formats.")
        return
      }

      const pdfBytes = await pdfDoc.save()
      setResult(pdfBytes)
      setStatusMessage(`Successfully converted ${successCount} images${skipCount > 0 ? ` (${skipCount} skipped)` : ""}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(`Conversion failed: ${errorMessage}`)
      console.error("Image to PDF conversion failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = () => {
    if (!result) return
    const blob = new Blob([result], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `converted-images-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Images to PDF</h3>
        <p className="text-muted-foreground">Convert your JPG or PNG images into a single PDF document.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <FileUpload
            accept="image/jpeg,image/png"
            onFilesChange={setFiles}
            multiple
            maxFiles={100}
            label="Upload JPG or PNG images"
            description="Up to 100 images (Max 10MB each)"
          />

          {files.length > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </div>
          )}

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertTitle className="text-destructive">Error</AlertTitle>
              <AlertDescription className="text-destructive/90">{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={files.length === 0 || isProcessing} onClick={processImages}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting {progress}%
              </>
            ) : (
              `Convert ${files.length} Image${files.length !== 1 ? "s" : ""}`
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              {statusMessage && (
                <p className="text-sm text-muted-foreground text-center">{statusMessage}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>Conversion Complete!</AlertTitle>
            <AlertDescription>{statusMessage || "Your images have been successfully converted into a PDF."}</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
              setResult(null)
              setFiles([])
              setStatusMessage("")
            }}>
              Convert More
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
