"use client"

import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const blogPosts = [
  {
    id: "why-privacy-matters",
    slug: "why-privacy-matters",
    title: "Why Your PDF Privacy Really Matters",
    excerpt:
      "Learn why keeping your documents private is important and how Your Private PDF keeps them safe without sending anything online.",
    date: "January 15, 2025",
    readTime: "5 min read",
    content: `
Your documents contain sensitive information—passwords, financial details, personal notes, and more.

When you use an online tool to handle PDFs, you're trusting a company to keep your files safe. But what if you didn't have to? What if your files never left your device?

## The Problem with Uploading Files

Every time you upload a PDF to a regular converter, you're:
- Sending your private information to someone else's computer
- Trusting them to delete it after processing
- Taking a risk that the file could be breached or misused

It sounds simple, but the risks add up. One mistake, one security issue, and your data could be exposed.

## How Your Private PDF Works Differently

Your Private PDF runs completely on your computer. When you upload a file, it stays in your browser—nowhere else. No servers. No uploads. No company storing your information.

This means:
- Your files are always under your control
- No one can access them but you
- They're gone as soon as you close the page
- You don't need to worry about breaches or misuse

## Why This Matters

Privacy isn't just nice to have—it's essential. Whether you're a business handling customer data or a person wanting to keep your life private, Your Private PDF gives you peace of mind.

Your documents deserve to stay private. And now they can.
    `,
  },
  {
    id: "how-to-merge-pdfs",
    slug: "how-to-merge-pdfs",
    title: "How to Combine Multiple PDFs Into One",
    excerpt:
      "A simple guide to merging PDFs without uploading them anywhere. Keep all your documents organized in one place.",
    date: "January 12, 2025",
    readTime: "4 min read",
    content: `
Combining multiple PDFs into one file makes documents easier to share and organize. Here's how to do it safely with Your Private PDF.

## Why Merge PDFs?

You might want to combine PDFs when:
- Creating a single document from multiple reports
- Putting together a complete project file
- Organizing contract pages into one file
- Merging invoice collections

## How to Merge with Your Private PDF

Using Your Private PDF to merge PDFs is straightforward:

1. Go to the "Combine PDFs" tool
2. Upload or drag all the PDF files you want to combine
3. Put them in the order you want
4. Click "Combine" and download your merged file

That's it. Your files stay on your device the entire time.

## Tips for the Best Results

- Arrange pages in the order you need before merging
- Check that all files merge correctly by previewing
- Make sure file sizes are reasonable for your computer
- Download your merged file right away

## Why Your Private PDF is Better for Merging

Traditional online tools send your files to the internet. Your Private PDF keeps everything local, so your documents are safer and the process is faster.

Try it now and see how easy it is to combine your PDFs privately.
    `,
  },
  {
    id: "reduce-pdf-file-size",
    slug: "reduce-pdf-file-size",
    title: "Make Your PDFs Smaller Without Losing Quality",
    excerpt:
      "Discover how to compress PDFs locally to save storage and make them easier to share, all without uploading to the internet.",
    date: "January 10, 2025",
    readTime: "5 min read",
    content: `
Large PDF files are hard to email, store, and share. Compressing them makes life easier. Here's how to do it with Your Private PDF.

## Why Compress PDFs?

Smaller files are better because:
- They're faster to email
- They take up less storage
- They're easier to share on messaging apps
- They load faster in email attachments

## Understanding Compression Levels

Your Private PDF offers three compression levels:

Low Compression: Small reduction in size, no noticeable quality loss. Good for sharing and storage.

Medium Compression: Better size reduction while keeping quality. Best for most uses.

High Compression: Maximum size reduction. Some quality loss, but still readable. Best for documents you don't need to print.

## How to Compress with Your Private PDF

1. Open the "Compress PDF" tool
2. Upload your PDF
3. Choose a compression level
4. See how much smaller your file becomes
5. Download your compressed PDF

Everything happens on your device—your file never goes online.

## Tips for Best Results

- Test different compression levels to find your balance
- Preview your result before downloading
- Save the original if you might need it later
- Use high compression for draft documents, low compression for final versions

Smaller PDFs mean easier sharing and less clutter. Try compressing yours today.
    `,
  },
  {
    id: "how-ocr-works",
    slug: "how-ocr-works",
    title: "Turn Scanned Documents Into Text You Can Copy",
    excerpt:
      "Learn how to extract text from scanned PDFs and images, making them searchable and editable on your device.",
    date: "January 8, 2025",
    readTime: "5 min read",
    content: `
When you scan a document, it becomes an image—you can't copy the text. This tool changes that. Here's how it works and why it matters.

## What Is Text Recognition?

Text recognition is technology that looks at an image and recognizes the words in it. It's like teaching a computer to read.

If you scan a receipt, invoice, or handwritten note, it reads it and converts it into text you can copy, edit, and search.

## Why Use Text Recognition?

You might use it when:
- Scanning receipts or invoices
- Converting scanned contracts into editable text
- Making old documents searchable
- Extracting text from photos of documents
- Creating archives of paper records

## How Your Private PDF's Text Recognition Works

1. Upload your scanned PDF or image
2. Your Private PDF reads the document on your device
3. It recognizes the text in the image
4. You get a text version you can copy and use

Everything happens locally—no uploading, no waiting on servers.

## Important Things to Know

- Text recognition works best with clear, straight documents
- Handwriting is harder to recognize than typed text
- The quality of the image affects accuracy
- Some symbols or special characters might not be recognized perfectly

## Tips for Best Results

- Use clear, high-quality scans
- Make sure documents are straight and flat
- Test with one page first
- Review the result to catch any mistakes

Text recognition turns your scanned documents into searchable, editable files. Try it with Your Private PDF today.
    `,
  },
]

export function BlogSection() {
  const router = useRouter()

  const handleBlogClick = (slug: string) => {
    sessionStorage.setItem("blogScrollPosition", window.scrollY.toString())
    router.push(`/blog/${slug}`)
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Learning Center</h2>
          <p className="text-muted-foreground">Tips and guides to help you get the most out of your PDFs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleBlogClick(post.slug)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <Button variant="ghost" className="gap-2 pl-0">
                  Read More <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
