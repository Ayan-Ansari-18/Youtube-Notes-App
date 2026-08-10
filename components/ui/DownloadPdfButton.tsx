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
        onclone: (doc, el) => {
          // Remove ALL stylesheets
          doc.querySelectorAll('link[rel="stylesheet"], style').forEach(s => s.remove())

          // Force override ALL inline styles that may contain lab() colors
          doc.querySelectorAll<HTMLElement>('*').forEach(node => {
            node.style.cssText = ''
            node.removeAttribute('class')
          })

          // Inject safe dark CSS
          const style = doc.createElement('style')
          style.innerHTML = `
            * { box-sizing: border-box; }
            body { background: #000000; color: #e5e5e5; font-family: Georgia, serif; margin: 0; padding: 0; }
            #${targetId} { background: #000000; color: #e5e5e5; padding: 40px; width: 900px; font-size: 14px; line-height: 1.8; }
            h1 { font-size: 28px; color: #ffffff; font-weight: bold; margin: 24px 0 12px; border-bottom: 1px solid #333333; padding-bottom: 8px; }
            h2 { font-size: 20px; color: #ffffff; font-weight: bold; margin: 20px 0 10px; }
            h3 { font-size: 16px; color: #cccccc; font-weight: bold; margin: 16px 0 8px; }
            p { margin: 8px 0; color: #e5e5e5; }
            ul, ol { padding-left: 24px; margin: 8px 0; }
            li { margin: 4px 0; color: #e5e5e5; }
            strong, b { color: #ffffff; font-weight: bold; }
            em, i { color: #cccccc; font-style: italic; }
            code { background: #1a1a1a; color: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
            pre { background: #111111; padding: 12px; border-radius: 6px; margin: 8px 0; }
            blockquote { border-left: 3px solid #e84040; padding-left: 12px; color: #aaaaaa; margin: 8px 0; }
            a { color: #e84040; }
            hr { border: none; border-top: 1px solid #333333; margin: 16px 0; }
          `
          doc.head.appendChild(style)
        }
      })

      const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const scale = pageWidth / canvas.width
      const scaledPageHeight = Math.floor(pageHeight / scale)
      const totalPages = Math.ceil(canvas.height / scaledPageHeight)

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage()

        const srcY = page * scaledPageHeight
        const srcH = Math.min(scaledPageHeight, canvas.height - srcY)

        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = scaledPageHeight
        const ctx = pageCanvas.getContext('2d')!
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

        const pageImgData = pageCanvas.toDataURL('image/png')
        pdf.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight)
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
