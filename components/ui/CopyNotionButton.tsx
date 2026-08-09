"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Copy, Check, FileText } from "lucide-react"

export function CopyNotionButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      // Notion works well with markdown, but we can wrap it slightly or just copy directly
      const notionFormatted = content;
      await navigator.clipboard.writeText(notionFormatted)
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
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <FileText className="w-4 h-4" />}
      {copied ? "Copied for Notion" : "Copy to Notion"}
    </Button>
  )
}
