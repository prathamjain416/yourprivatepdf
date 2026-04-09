"use client"

import { useState, useEffect } from "react"
import { Shield, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PrivacyShield } from "@/components/privacy-shield"
import { ToolGrid, type ToolId } from "@/components/tool-grid"
import { PDFToText } from "@/components/converters/pdf-to-text"
import { PDFMerge } from "@/components/converters/pdf-merge"
import { ImagesToPDF } from "@/components/converters/images-to-pdf"
import { CompressPDF } from "@/components/converters/compress-pdf"
import { OCRScan } from "@/components/converters/ocr-scan"
import { SplitPDF } from "@/components/converters/split-pdf"
import { RotatePDF } from "@/components/converters/rotate-pdf"
import { PDFWatermark } from "@/components/converters/pdf-watermark"
import { ExtractImages } from "@/components/converters/extract-images"
import { RemovePages } from "@/components/converters/remove-pages"
import { TextToPDF } from "@/components/converters/text-to-pdf"
import { Button } from "@/components/ui/button"
import { FAQSection } from "@/components/faq-section"
import Link from "next/link"

export default function PDFConverter() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeTool, activeBlogPost])

  const renderTool = () => {
    switch (activeTool) {
      case "pdf-to-text":
        return <PDFToText />
      case "merge-pdf":
        return <PDFMerge />
      case "images-to-pdf":
        return <ImagesToPDF />
      case "compress-pdf":
        return <CompressPDF />
      case "ocr-scan":
        return <OCRScan />
      case "split-pdf":
        return <SplitPDF />
      case "rotate-pdf":
        return <RotatePDF />
      case "pdf-watermark":
        return <PDFWatermark />
      case "extract-images":
        return <ExtractImages />
      case "remove-pages":
        return <RemovePages />
      case "text-to-pdf":
        return <TextToPDF />
      default:
        return (
          <div className="text-center py-12 space-y-4">
            <h3 className="text-xl font-semibold">Tool coming soon!</h3>
            <p className="text-muted-foreground">
              We are working hard to implement {activeTool} locally in your browser.
            </p>
            <Button variant="outline" onClick={() => setActiveTool(null)}>
              Go Back
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {activeTool ? (
          <div className="container mx-auto px-4 py-12">
            <Button variant="ghost" className="mb-8 -ml-4" onClick={() => setActiveTool(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
            {renderTool()}
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="py-20 bg-linear-to-b from-primary/5 to-background">
              <div className="container mx-auto px-4 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  <Shield className="w-3.5 h-3.5" />
                  100% Private Local Processing
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                  The PDF tool that <span className="text-primary">never</span> sees your files.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                  Convert, merge, and edit PDFs entirely in your browser. No uploads, no servers, no tracking. Your data
                  stays where it belongs: with you.
                </p>
              </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-16 container mx-auto px-4">
              <div className="flex flex-col space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Powerful PDF Tools</h2>
                  <p className="text-muted-foreground">Select a tool to start processing your files locally.</p>
                </div>

                <ToolGrid onSelectTool={setActiveTool} />
              </div>
            </section>

            {/* Privacy Section */}
            <section className="py-24 bg-muted/30">
              <div className="container mx-auto px-4 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">Privacy First by Architecture</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    We've built Your Private PDF using modern browser technologies like Web Workers and WebAssembly so
                    your sensitive documents never touch our infrastructure.
                  </p>
                </div>
                <PrivacyShield />
              </div>
            </section>

            {/* Learning Center Section */}
            <section className="py-24 bg-muted/30">
              <div className="container mx-auto px-4 space-y-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Learning Center</h2>
                  <p className="text-muted-foreground">Tips and guides to help you get the most out of your PDFs.</p>
                </div>
                <Link href="/blog">
                  <Button size="lg">View All Articles</Button>
                </Link>
              </div>
            </section>

            {/* FAQ Section */}
            <FAQSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
