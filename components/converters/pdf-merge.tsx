"use client"

import * as React from "react"
import { Merge, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PDFDocument } from "pdf-lib"

export function PDFMerge() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<Uint8Array | null>(null)

  const processMerge = async () => {
    if (files.length < 2) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))

        const currentProgress = Math.round(((i + 1) / files.length) * 100)
        setProgress(currentProgress)

        // [v0] Log merge progress
        console.log(`[v0] Merged ${file.name} (${i + 1}/${files.length})`)
      }

      const pdfBytes = await mergedPdf.save()
      setResult(pdfBytes)
    } catch (error) {
      console.error("[v0] PDF merge failed:", error)
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
    a.download = `merged-document-${Date.now()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Merge PDFs</h3>
        <p className="text-muted-foreground">Combine multiple PDF files into one single document locally.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <FileUpload
            onFilesChange={setFiles}
            multiple
            maxFiles={10}
            description="Up to 10 PDF files (Max 50MB each)"
          />
          <Button className="w-full" disabled={files.length < 2 || isProcessing} onClick={processMerge}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Merging {progress}%
              </>
            ) : (
              `Merge ${files.length} Files`
            )}
          </Button>
          {isProcessing && <Progress value={progress} className="h-2" />}
          {files.length === 1 && (
            <p className="text-xs text-center text-amber-600">Please select at least 2 files to merge.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <Merge className="h-4 w-4" />
            <AlertTitle>Merge Complete!</AlertTitle>
            <AlertDescription>Your PDF files have been combined into a single document.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setResult(null)}>
              Reset
            </Button>
            <Button className="flex-1" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Merged PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
