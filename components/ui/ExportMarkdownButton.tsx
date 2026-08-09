"use client"

import { Button } from "@/components/ui/Button"
import { FileDown } from "lucide-react"

export function ExportMarkdownButton({ content, filename }: { content: string, filename: string }) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    
    const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`
    link.setAttribute("download", safeFilename)
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button 
      onClick={handleDownload} 
      variant="outline" 
      className="gap-2 shrink-0 border-white/20 hover:bg-white/10"
    >
      <FileDown className="w-4 h-4" />
      Export .md
    </Button>
  )
}
