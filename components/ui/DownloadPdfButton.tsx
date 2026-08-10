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

      const html2canvas = (await import('html2canvas')).default
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.jsPDF || (jsPDFModule as any).default?.jsPDF || (jsPDFModule as any).default

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
        onclone: (_doc, el) => {
          const style = _doc.createElement('style')
          style.innerHTML = `* { color: inherit !important; background-color: inherit !important; }`
          _doc.head.appendChild(style)
          el.style.background = '#000000'
          el.style.padding = '40px'
          el.style.width = '900px'
        }
      })

      const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Scale canvas width to fit page
      const scale = pageWidth / canvas.width
      const scaledPageHeight = pageHeight / scale

      const totalPages = Math.ceil(canvas.height / scaledPageHeight)

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage()

        // Crop canvas for this page slice
        const srcY = page * scaledPageHeight
        const srcH = Math.min(scaledPageHeight, canvas.height - srcY)

        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = srcH
        const ctx = pageCanvas.getContext('2d')!
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

        const pageImgData = pageCanvas.toDataURL('image/png')
        const renderedHeight = srcH * scale
        pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, renderedHeight)
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
