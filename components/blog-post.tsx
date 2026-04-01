"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogPostProps {
  post: {
    title: string
    date: string
    readTime: string
    content: string
  }
  onBack: () => void
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Button variant="ghost" className="mb-8 -ml-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>

      <article className="prose prose-sm dark:prose-invert max-w-none">
        <header className="mb-8 pb-8 border-b">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="space-y-6 text-base leading-relaxed">
          {post.content.split("\n\n").map((paragraph, idx) => {
            if (paragraph.startsWith("##")) {
              return (
                <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">
                  {paragraph.replace(/^##\s+/, "")}
                </h2>
              )
            }
            if (paragraph.startsWith("-")) {
              return (
                <ul key={idx} className="list-disc list-inside space-y-2">
                  {paragraph.split("\n").map((item, itemIdx) => (
                    <li key={itemIdx} className="ml-2">
                      {item.replace(/^-\s+/, "")}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={idx} className="text-muted-foreground">
                {paragraph}
              </p>
            )
          })}
        </div>
      </article>
    </div>
  )
}
