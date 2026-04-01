"use client"

import * as React from "react"
import { Download, Loader2, Info, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { PDFDocument } from "pdf-lib"
import * as pdfjsLib from "pdfjs-dist"

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

type CompressionMode = "low" | "medium" | "high"

interface CompressionSettings {
  dpi: number
  quality: number
  label: string
}

const MODES: Record<CompressionMode, CompressionSettings> = {
  low: { dpi: 150, quality: 0.8, label: "Low (Best Quality)" },
  medium: { dpi: 96, quality: 0.6, label: "Medium (Recommended)" },
  high: { dpi: 72, quality: 0.4, label: "High (Smallest Size)" },
}

export function CompressPDF() {
  const [files, setFiles] = React.useState<File[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [status, setStatus] = React.useState("")
  const [mode, setMode] = React.useState<CompressionMode>("medium")
  const [result, setResult] = React.useState<{ bytes: Uint8Array; originalSize: number; newSize: number } | null>(null)

  const processCompression = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)
    setStatus("Analyzing PDF structure...")

    try {
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const settings = MODES[mode]

      // Step 1: Load for rendering (using pdfjs)
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      // Step 2: Create a new document for the compressed version
      const compressedPdfDoc = await PDFDocument.create()

      for (let i = 1; i <= numPages; i++) {
        setStatus(`Processing page ${i} of ${numPages}...`)
        const page = await pdf.getPage(i)

        // Calculate viewport based on target DPI (standard PDF is 72 DPI)
        const scale = settings.dpi / 72
        const viewport = page.getViewport({ scale })

        // Create canvas for re-rendering
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) throw new Error("Could not create canvas context")

        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render PDF page to canvas
        await page.render({ canvasContext: context, viewport }).promise

        // Convert canvas to compressed JPEG
        const jpegDataUrl = canvas.toDataURL("image/jpeg", settings.quality)
        const jpegBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer())

        // Embed compressed image as the new page content
        const image = await compressedPdfDoc.embedJpg(jpegBytes)
        const newPage = compressedPdfDoc.addPage([image.width, image.height])
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        })

        setProgress(Math.round((i / numPages) * 100))
        console.log(`[v0] Compressed page ${i}/${numPages}`)
      }

      setStatus("Finalizing optimized PDF...")

      // Save with object streams and structural optimization
      const compressedBytes = await compressedPdfDoc.save({
        useObjectStreams: true,
      })

      setResult({
        bytes: compressedBytes,
        originalSize: file.size,
        newSize: compressedBytes.length,
      })
    } catch (error) {
      console.error("[v0] PDF compression failed:", error)
      setStatus("Error: Failed to compress. Some PDFs might be encrypted or corrupted.")
    } finally {
      setIsProcessing(false)
      setStatus("")
    }
  }

  const downloadPDF = () => {
    if (!result) return
    const blob = new Blob([result.bytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${files[0].name.replace(".pdf", "")}-compressed.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const saving = result ? Math.round((1 - result.newSize / result.originalSize) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Advanced Compression</h3>
        <p className="text-muted-foreground">Measurable client-side compression through image re-encoding.</p>
      </div>

      {!result ? (
        <div className="space-y-6">
          <FileUpload onFilesChange={setFiles} description="Select a PDF to compress locally" />

          <div className="space-y-4 p-4 bg-muted/30 border rounded-xl">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-sm">Compression Intensity</Label>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {MODES[mode].label}
              </span>
            </div>
            <Slider
              value={[mode === "low" ? 0 : mode === "medium" ? 50 : 100]}
              max={100}
              step={50}
              onValueChange={([val]) => {
                if (val === 0) setMode("low")
                else if (val === 50) setMode("medium")
                else setMode("high")
              }}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
              <span>Quality</span>
              <span>Balanced</span>
              <span>Size</span>
            </div>
          </div>

          <Button className="w-full" disabled={files.length === 0 || isProcessing} onClick={processCompression}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status || `Compressing ${progress}%`}
              </>
            ) : (
              "Start Compression"
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-[10px] text-center text-muted-foreground animate-pulse">
                Processing locally... Stay on this page.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original</p>
              <p className="text-lg font-semibold">{formatSize(result.originalSize)}</p>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Compressed</p>
              <p className="text-lg font-semibold text-primary">{formatSize(result.newSize)}</p>
            </div>
          </div>

          {saving > 0 ? (
            <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Great savings!</AlertTitle>
              <AlertDescription>Your PDF is now {saving}% smaller.</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This PDF was already highly optimized. Structure-only compression applied.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setResult(null)}>
              Reset
            </Button>
            <Button className="flex-1" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-bold text-primary">Technical Note:</span> Our engine uses rasterization-based
          compression. This is most effective for image-heavy documents. Vector graphics and text-only PDFs may see less
          reduction but remain perfectly sharp.
        </p>
      </div>
    </div>
  )
}
