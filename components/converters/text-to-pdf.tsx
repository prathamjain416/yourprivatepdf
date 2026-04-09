"use client"

import React, { useState } from "react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Loader2, FileType } from "lucide-react"

export function TextToPDF() {
  const [textContent, setTextContent] = useState("")
  const [fontSize, setFontSize] = useState(12)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createPDFFromText = async () => {
    if (!textContent.trim()) {
      setError("Please enter some text")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Standard letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const margin = 40
      const pageWidth = 612
      const pageHeight = 792
      const contentWidth = pageWidth - 2 * margin
      let yPosition = pageHeight - margin

      // Split text into lines, handling both spaces and newlines
      const paragraphs = textContent.split("\n")
      const lines: string[] = []

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          lines.push("") // Empty line for paragraph break
          continue
        }

        const words = paragraph.split(" ")
        let currentLine = ""

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const textWidth = font.widthOfTextAtSize(testLine, fontSize)

          if (textWidth > contentWidth) {
            if (currentLine) {
              lines.push(currentLine)
            }
            currentLine = word
          } else {
            currentLine = testLine
          }
        }

        if (currentLine) {
          lines.push(currentLine)
        }
      }

      // Draw text on page
      let currentPage = page
      for (const line of lines) {
        if (yPosition < margin + fontSize) {
          // Create new page if we run out of space
          currentPage = pdfDoc.addPage([612, 792])
          yPosition = pageHeight - margin
        }

        currentPage.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        })

        yPosition -= fontSize + 4 // Line spacing
      }

      const pdfBytes = await pdfDoc.save()
      setResult(pdfBytes)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create PDF"
      setError(errorMsg)
      console.error("[v0] Text to PDF error:", err)
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
    a.download = "document.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Create PDF from Text</h3>
        <p className="text-muted-foreground">Convert your text into a professionally formatted PDF document.</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-content" className="text-sm">
              Your text
            </Label>
            <textarea
              id="text-content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full min-h-64 p-3 border rounded-lg bg-background text-sm resize-vertical"
            />
            <p className="text-xs text-muted-foreground">
              {textContent.length} characters
            </p>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="font-size" className="text-sm">
              Font size: {fontSize}px
            </Label>
            <input
              id="font-size"
              type="range"
              min="8"
              max="28"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" disabled={!textContent.trim() || isProcessing} onClick={createPDFFromText}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating PDF
              </>
            ) : (
              "Create PDF"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <Alert className="bg-primary/5 border-primary/20">
            <FileType className="h-4 w-4" />
            <AlertTitle>PDF Created!</AlertTitle>
            <AlertDescription>Your text has been successfully converted to a PDF.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setTextContent("")
                setResult(null)
                setError(null)
              }}
            >
              Create Another
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
