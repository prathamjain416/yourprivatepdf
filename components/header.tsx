import { Shield } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
            <img src="/icon.svg" alt="Logo" className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Your Private PDF</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#tools" className="text-sm font-medium hover:text-primary transition-colors">
            Tools
          </Link>
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-500/20">
            <Shield className="w-3 h-3" />
            SECURE & LOCAL
          </div>
        </nav>
      </div>
    </header>
  )
}
