"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Download } from "lucide-react"

export function DownloadPdfButton({ targetId, filename }: { targetId: string, filename: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const element = document.getElementById(targetId)
      if (!element) return

      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.jsPDF || (jsPDFModule as any).default?.jsPDF || (jsPDFModule as any).default

      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 40
      const maxWidth = pageWidth - margin * 2
      let y = margin + 20

      const lines = element.innerText.split('\n').filter(l => l.trim() !== '')

      for (const line of lines) {
        const trimmed = line.trim()
        let fontSize = 11
        let isBold = false

        if (trimmed.startsWith('# ')) {
          fontSize = 22; isBold = true
        } else if (trimmed.startsWith('## ')) {
          fontSize = 17; isBold = true
        } else if (trimmed.startsWith('### ')) {
          fontSize = 13; isBold = true
        }

        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
        pdf.setTextColor(30, 30, 30)

        const text = trimmed.replace(/^#{1,3} /, '').replace(/\*\*(.*?)\*\*/g, '$1')
        const wrapped = pdf.splitTextToSize(text, maxWidth)

        const blockHeight = wrapped.length * (fontSize * 1.4)
        if (y + blockHeight > pageHeight - margin) {
          pdf.addPage()
          y = margin + 20
        }

        pdf.text(wrapped, margin, y)
        y += blockHeight + (isBold ? 8 : 4)
      }

      pdf.save(`${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed: ' + (err as any)?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} variant="outline" className="gap-2 shrink-0 border-white/20 hover:bg-white/10">
      <Download className="w-4 h-4" />
      {loading ? 'Generating...' : 'Download PDF'}
    </Button>
  )
}
