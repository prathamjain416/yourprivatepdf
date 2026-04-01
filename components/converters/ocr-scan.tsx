"use client"

import * as React from "react"
import { Search, Download, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as pdfjsLib from "pdfjs-dist"
import { createWorker } from "tesseract.js"

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export function OCRScan() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [status, setStatus] = React.useState("")
  const [progress, setProgress] = React.useState(0)
  const [result, setResult] = React.useState<string | null>(null)

  const processOCR = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)
    setStatus("Loading PDF...")

    let worker: any = null

    try {
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      setStatus("Initializing OCR engine...")
      worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pageProgress = Math.round(m.progress * 100)
            console.log(`[v0] OCR Progress: ${pageProgress}%`)
          }
        },
      })

      let fullText = ""

      for (let i = 1; i <= numPages; i++) {
        setStatus(`Processing page ${i} of ${numPages}...`)
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 }) // High scale for better OCR

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise

          // Perform OCR on the page canvas
          const {
            data: { text },
          } = await worker.recognize(canvas)
          fullText += `--- Page ${i} ---\n${text}\n\n`

          console.log(`[v0] OCR completed for page ${i}`)
          setProgress(Math.round((i / numPages) * 100))
        }
      }

      setResult(fullText)
    } catch (error) {
      console.error("[v0] OCR scan failed:", error)
      setStatus("Error processing document.")
    } finally {
      if (worker) await worker.terminate()
      setIsProcessing(false)
      setStatus("")
    }
  }

  const downloadText = () => {
    if (!result) return
    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${files[0].name.replace(".pdf", "")}-ocr.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">OCR Scan (Beta)</h3>
        <p className="text-muted-foreground">Recognize and extract text from scanned PDF images locally.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <FileUpload onFilesChange={setFiles} description="Upload a scanned PDF document" />

          <Alert variant="default" className="bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-xs font-bold uppercase tracking-wider">Performance Note</AlertTitle>
            <AlertDescription className="text-xs">
              OCR runs entirely in your browser. Large files may take several minutes and significant memory. Keep this
              tab active during processing.
            </AlertDescription>
          </Alert>

          <Button className="w-full" disabled={files.length === 0 || isProcessing} onClick={processOCR}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status || `Processing ${progress}%`}
              </>
            ) : (
              "Start OCR Scan"
            )}
          </Button>
          {isProcessing && <Progress value={progress} className="h-2" />}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <Search className="h-4 w-4" />
            <AlertTitle>OCR Complete!</AlertTitle>
            <AlertDescription>Recognized {result.split(/\s+/).length} words from your document.</AlertDescription>
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
              Download Result
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
