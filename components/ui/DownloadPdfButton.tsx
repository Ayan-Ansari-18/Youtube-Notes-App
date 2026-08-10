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

      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#000000' })
      const imgData = canvas.toDataURL('image/jpeg', 0.95)

      const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = pdfHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()

      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight()
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }

      const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`
      pdf.save(safeFilename)
    } catch (err) {
      console.error('PDF generation failed:', err)
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
