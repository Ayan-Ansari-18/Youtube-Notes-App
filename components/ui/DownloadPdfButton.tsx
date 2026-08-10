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
      const margin = 48
      const contentWidth = pageWidth - margin * 2
      let y = margin

      // Fill first page background
      const fillPageBg = () => {
        pdf.setFillColor(10, 10, 10)
        pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      }
      fillPageBg()

      const addPage = () => {
        pdf.addPage()
        fillPageBg()
        y = margin
      }

      const checkY = (needed: number) => {
        if (y + needed > pageHeight - margin) addPage()
      }

      // Parse innerText lines
      const rawLines = element.innerText.split('\n')

      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i]
        const trimmed = line.trim()
        if (!trimmed) { y += 8; continue }

        // H1
        if (trimmed.startsWith('# ')) {
          const text = trimmed.replace(/^# /, '')
          checkY(40)
          pdf.setFontSize(22)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(255, 255, 255)
          const wrapped = pdf.splitTextToSize(text, contentWidth)
          wrapped.forEach((wl: string) => {
            checkY(28)
            pdf.text(wl, margin, y)
            y += 28
          })
          // underline
          pdf.setDrawColor(80, 80, 80)
          pdf.line(margin, y, pageWidth - margin, y)
          y += 14
        }
        // H2
        else if (trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^## /, '')
          checkY(32)
          y += 6
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(232, 64, 64)
          const wrapped = pdf.splitTextToSize(text, contentWidth)
          wrapped.forEach((wl: string) => {
            checkY(22)
            pdf.text(wl, margin, y)
            y += 22
          })
          y += 6
        }
        // H3
        else if (trimmed.startsWith('### ')) {
          const text = trimmed.replace(/^### /, '')
          checkY(24)
          y += 4
          pdf.setFontSize(13)
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(200, 200, 200)
          const wrapped = pdf.splitTextToSize(text, contentWidth)
          wrapped.forEach((wl: string) => {
            checkY(18)
            pdf.text(wl, margin, y)
            y += 18
          })
          y += 4
        }
        // Bullet
        else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const text = trimmed.replace(/^[-•] /, '').replace(/\*\*(.*?)\*\*/g, '$1')
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(220, 220, 220)
          const wrapped = pdf.splitTextToSize(text, contentWidth - 16)
          wrapped.forEach((wl: string, wi: number) => {
            checkY(16)
            if (wi === 0) {
              pdf.setTextColor(232, 64, 64)
              pdf.text('•', margin, y)
              pdf.setTextColor(220, 220, 220)
              pdf.text(wl, margin + 14, y)
            } else {
              pdf.text(wl, margin + 14, y)
            }
            y += 16
          })
          y += 2
        }
        // Normal text
        else {
          const text = trimmed.replace(/\*\*(.*?)\*\*/g, '$1')
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(200, 200, 200)
          const wrapped = pdf.splitTextToSize(text, contentWidth)
          wrapped.forEach((wl: string) => {
            checkY(16)
            pdf.text(wl, margin, y)
            y += 16
          })
          y += 4
        }
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
