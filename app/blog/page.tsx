"use client"

import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"

const blogPosts = [
  {
    id: "why-privacy-matters",
    slug: "why-privacy-matters",
    title: "Why Your PDF Privacy Really Matters",
    excerpt:
      "Learn why keeping your documents private is important and how Your Private PDF keeps them safe without sending anything online.",
    date: "January 15, 2025",
    readTime: "5 min read",
  },
  {
    id: "how-to-merge-pdfs",
    slug: "how-to-merge-pdfs",
    title: "How to Combine Multiple PDFs Into One",
    excerpt:
      "A simple guide to merging PDFs without uploading them anywhere. Keep all your documents organized in one place.",
    date: "January 12, 2025",
    readTime: "4 min read",
  },
  {
    id: "reduce-pdf-file-size",
    slug: "reduce-pdf-file-size",
    title: "Make Your PDFs Smaller Without Losing Quality",
    excerpt:
      "Discover how to compress PDFs locally to save storage and make them easier to share, all without uploading to the internet.",
    date: "January 10, 2025",
    readTime: "5 min read",
  },
  {
    id: "how-ocr-works",
    slug: "how-ocr-works",
    title: "Turn Scanned Documents Into Text You Can Copy",
    excerpt:
      "Learn how to extract text from scanned PDFs and images, making them searchable and editable on your device.",
    date: "January 8, 2025",
    readTime: "5 min read",
  },
]

export default function BlogIndexPage() {
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("blogScrollPosition")
    if (savedScrollPosition) {
      window.scrollTo(0, Number.parseInt(savedScrollPosition))
      sessionStorage.removeItem("blogScrollPosition")
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  return (
    <section className="py-24 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Learning Center</h2>
          <p className="text-muted-foreground">Tips and guides to help you get the most out of your PDFs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={() => {
                sessionStorage.setItem("blogScrollPosition", window.scrollY.toString())
              }}
            >
              <Card className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer h-full">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
