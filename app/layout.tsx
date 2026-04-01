import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Your Private PDF - Secure & 100% Local Client-Side PDF Tools",
  description:
    "Your Private PDF is the world's most secure PDF tool. Convert, merge, compress, and OCR PDFs entirely in your browser with zero uploads.",
  keywords: [
    "Your Private PDF",
    "private PDF converter",
    "secure PDF editor",
    "local PDF processing",
    "no upload PDF tool",
    "offline PDF tools",
    "browser-based PDF editor",
    "free PDF converter",
    "secure document processing",
    "client-side PDF tools",
    "PDF compression guide",
    "how to merge PDFs",
    "OCR for scanned documents",
    "reduce PDF file size",
    "PDF privacy tips",
  ],
  authors: [{ name: "Your Private PDF Team" }],
  creator: "Your Private PDF",
  publisher: "Your Private PDF",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Your Private PDF - Secure & 100% Local Client-Side PDF Tools",
    description: "The world's most private PDF tool. Your data stays on your device.",
    url: "https://yourprivatepdf.com",
    siteName: "Your Private PDF",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Private PDF - Secure & 100% Local Client-Side PDF Tools",
    description: "100% Client-Side PDF Processing. No uploads, no tracking.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Your Private PDF",
              description:
                "A high-performance, privacy-first PDF toolset that processes all files locally in the browser with no server uploads.",
              url: "https://yourprivatepdf.com",
              applicationCategory: "PDF Tool",
              operatingSystem: "Any",
              featureList: [
                "Local PDF Compression",
                "Private PDF Merging",
                "Client-side PDF to Text Extraction",
                "Secure Images to PDF Conversion",
                "Browser-based OCR Scanning",
              ],
              faqPage: "https://yourprivatepdf.com#faq",
              blogPage: "https://yourprivatepdf.com#blog",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
