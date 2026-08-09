"use client"

import { Button } from "@/components/ui/Button"
import { Download } from "lucide-react"

export function DownloadPdfButton({ targetId, filename }: { targetId: string, filename: string }) {
  const handleDownload = async () => {
    const element = document.getElementById(targetId)
    if (!element) return

    // Dynamically import html2pdf so it doesn't break SSR
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    const opt = {
      margin:       0.5,
      filename:     `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  }

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2 shrink-0 border-white/20 hover:bg-white/10">
      <Download className="w-4 h-4" />
      Download PDF
    </Button>
  )
}
