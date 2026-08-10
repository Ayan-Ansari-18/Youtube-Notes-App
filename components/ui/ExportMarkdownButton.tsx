"use client"

import { Button } from "@/components/ui/Button"
import { FileDown } from "lucide-react"

export function ExportMarkdownButton({ content, filename }: { content: string, filename: string }) {
  const handleDownload = () => {
    const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = safeFilename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2 shrink-0 border-white/20 hover:bg-white/10">
      <FileDown className="w-4 h-4" />
      Export .md
    </Button>
  )
}
