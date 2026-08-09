"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Key, Copy, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function ApiKeyManager({ initialKey }: { initialKey: string | null }) {
  const [apiKey, setApiKey] = useState<string | null>(initialKey)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateKey = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/user/api-key", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setApiKey(data.apiKey)
        toast.success("API Key generated successfully!")
      } else {
        toast.error(data.error || "Failed to generate API Key")
      }
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyKey = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("API Key copied to clipboard")
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">API Access</h3>
          <p className="text-sm text-muted">Use this key to access your notes programmatically.</p>
        </div>
      </div>

      {apiKey ? (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-sm break-all w-full md:w-auto">
            {apiKey}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button onClick={copyKey} variant="outline" className="flex-1 md:flex-none gap-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button onClick={generateKey} disabled={isGenerating} variant="outline" className="flex-1 md:flex-none gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-white/10">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted mb-4">You don't have an API key yet. Generate one to get started.</p>
          <Button onClick={generateKey} disabled={isGenerating} className="gap-2 bg-accent text-background hover:bg-accent/90">
            <Key className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate API Key"}
          </Button>
        </div>
      )}
    </div>
  )
}
