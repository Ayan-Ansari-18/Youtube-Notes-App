"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlaySquare, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation({ session }: { session: any }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
            <Image src="/logo.png" alt="YT Notes Logo" fill className="object-contain drop-shadow-md" />
          </div>
          <span className="font-bold text-xl tracking-tight">YT Notes</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/#product" className="hover:text-foreground transition-colors">Product</Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/#about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4 text-muted">
          {session ? (
            <Link href="/dashboard" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:block text-sm font-medium hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors">Get Started</Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-background/95 backdrop-blur-xl border-t border-border flex flex-col items-center pt-12 gap-8 text-lg font-medium">
          <Link href="/#product" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors">Product</Link>
          <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors">How it works</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors">About</Link>
          
          <div className="mt-8 flex flex-col gap-4 w-full px-8">
            {session ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-foreground text-background text-center rounded-xl font-bold">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 border border-white/20 text-center rounded-xl font-bold">Sign In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-foreground text-background text-center rounded-xl font-bold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
