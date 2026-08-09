"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Copy, Check } from "lucide-react"

export function CopyNotesButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button 
      onClick={handleCopy} 
      variant="outline" 
      className="gap-2 shrink-0 border-white/20 hover:bg-white/10"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  )
}
