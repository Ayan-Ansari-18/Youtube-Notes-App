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
          // Fix lab() color issue by injecting safe CSS overrides
          const style = _doc.createElement('style')
          style.innerHTML = `
            * {
              color: #ffffff !important;
              background-color: transparent !important;
              border-color: #333333 !important;
            }
            h1, h2, h3, h4, h5, h6 { color: #ffffff !important; }
            p, li, span, td, th { color: #e5e5e5 !important; }
            code { background-color: #1a1a1a !important; color: #f0f0f0 !important; }
            pre { background-color: #111111 !important; }
            a { color: #e84040 !important; }
            strong { color: #ffffff !important; }
          `
          _doc.head.appendChild(style)
          el.style.backgroundColor = '#000000'
          el.style.padding = '40px'
        }
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let y = 0
      let remaining = imgHeight
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, -y, pageWidth, imgHeight)
        remaining -= pageHeight
        y += pageHeight
        if (remaining > 0) pdf.addPage()
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
