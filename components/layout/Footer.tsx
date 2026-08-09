import Link from "next/link"
import { PlaySquare } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-2">
            <PlaySquare className="h-5 w-5 text-accent" />
            <span className="font-bold text-lg tracking-tight">YouTube Notes</span>
          </div>
          
          <div className="flex gap-8 text-sm text-muted">
            <Link href="#product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted border-t border-border pt-8">
          <p>© {new Date().getFullYear()} YouTube Notes. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
