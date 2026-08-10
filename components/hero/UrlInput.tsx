"use client"
import { useState, useEffect } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

export function UrlInput() {
  const [url, setUrl] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isPro, setIsPro] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data?.user?.plan === 'PRO' || data?.user?.plan === 'ENTERPRISE') {
          setIsPro(true)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 99) return 99;
          const diff = Math.random() * 8;
          return Math.min(99, p + diff);
        });
      }, 400);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot Trap: If a bot fills this invisible field, we stop them here.
    if (honeypot) {
      console.warn("Bot detected via honeypot.")
      setError("An unexpected error occurred. Please try again.") // Fake error for bots
      return
    }

    if (!url) return
    
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customPrompt })
      })

      const data = await res.json()

      // If user is not logged in, redirect them to sign up
      if (res.status === 401 || (data.error && data.error.toLowerCase().includes("unauthorized"))) {
        router.push("/signup")
        return
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to process video")
      }

      if (data.note?.id) {
        router.push(`/notes/${data.note.id}`)
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group flex flex-col gap-3">
        {/* Invisible Honeypot Field */}
        <input 
          type="text" 
          name="website" 
          value={honeypot} 
          onChange={(e) => setHoneypot(e.target.value)} 
          style={{ display: 'none' }} 
          tabIndex={-1} 
          autoComplete="off" 
          aria-hidden="true"
        />

        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-3xl blur-md md:blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-[#050505]/90 md:bg-[#050505]/80 backdrop-blur-sm md:backdrop-blur-xl border border-white/10 rounded-full p-1 md:p-2 hover:border-white/20 transition-colors shadow-2xl">
          <input 
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError("")
            }}
            disabled={isLoading}
            placeholder="Paste YouTube link here..."
            className="flex-1 bg-transparent border-none text-foreground px-6 py-4 outline-none placeholder:text-muted/50 text-lg disabled:opacity-50"
            required
          />
          <button 
            type="submit"
            disabled={isLoading || !url}
            className="bg-foreground text-background p-4 rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 ml-2 shrink-0 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
        {isPro && (
          <div className="relative flex items-center bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-1 transition-colors z-10 mx-4">
            <input 
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="✨ Enterprise Feature: Custom AI Instructions (e.g. Hindi me likho, sirf bullet points)..."
              className="flex-1 bg-transparent border-none text-foreground/80 px-4 py-3 outline-none placeholder:text-accent/50 text-sm disabled:opacity-50 focus:text-foreground"
            />
          </div>
        )}
      </form>
      {error && (
        <div className={`mt-6 p-4 rounded-xl flex items-center justify-between border ${error.includes('limit') ? 'border-accent/50 bg-accent/10 text-accent' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
          <p className="text-sm font-medium">{error}</p>
          {error.includes('limit') && (
            <button 
              onClick={() => router.push('/pricing')}
              className="text-xs font-bold uppercase tracking-wide bg-accent text-background px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
          <div className="flex flex-col items-center w-full max-w-md px-8 space-y-8">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border border-accent/20">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-[spin_3s_linear_infinite]"></div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Processing Video</h3>
              <p className="text-muted text-sm font-mono tracking-widest uppercase">Extracting Knowledge</p>
            </div>

            <div className="w-full space-y-3">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-xs font-mono text-muted tracking-wider">
                <span>{Math.floor(progress)}% DONE</span>
                <span>{100 - Math.floor(progress)}% REMAINING</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
