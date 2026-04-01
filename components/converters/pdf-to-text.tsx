"use client"

import * as React from "react"
import { FileText, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as pdfjsLib from "pdfjs-dist"

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export function PDFToText() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<string | null>(null)

  const processPDF = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ""
      const numPages = pdf.numPages

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")

        fullText += `--- Page ${i} ---\n${pageText}\n\n`
        setProgress(Math.round((i / numPages) * 100))

        // [v0] Log progress for debugging
        console.log(`[v0] Extracted text for page ${i}/${numPages}`)
      }

      setResult(fullText)
    } catch (error) {
      console.error("[v0] PDF extraction failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadText = () => {
    if (!result) return
    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${files[0].name.replace(".pdf", "")}-extracted.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">PDF to Text</h3>
        <p className="text-muted-foreground">Extract all text content from your PDF file locally.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <FileUpload onFilesChange={setFiles} />
          <Button className="w-full" disabled={files.length === 0 || isProcessing} onClick={processPDF}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing {progress}%
              </>
            ) : (
              "Extract Text"
            )}
          </Button>
          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileText className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Extracted {result.length.toLocaleString()} characters from your document.
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-muted/50 border rounded-lg max-h-[300px] overflow-y-auto text-xs font-mono whitespace-pre-wrap">
            {result}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setResult(null)}>
              Reset
            </Button>
            <Button className="flex-1" onClick={downloadText}>
              <Download className="mr-2 h-4 w-4" />
              Download TXT
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
