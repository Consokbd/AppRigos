'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface Props {
  agentId: string
}

export default function AgentProfileActions({ agentId }: Props) {
  async function downloadPdf() {
    const el = document.getElementById('agent-profile-card')
    if (!el) return

    const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    // convert px to mm (approx)
    const pxToMm = (px: number) => px * 0.264583
    const widthMm = pxToMm(canvas.width)
    const heightMm = pxToMm(canvas.height)

    const pdf = new jsPDF({ orientation: widthMm > heightMm ? 'landscape' : 'portrait', unit: 'mm', format: [widthMm, heightMm] })
    pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm)
    pdf.save(`fiche-agent-${agentId}.pdf`)
  }

  function printCard() {
    const el = document.getElementById('agent-profile-card')
    if (!el) return

    const printWindow = window.open('', '_blank', 'width=800,height=1000')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Impression - Fiche agent</title>
          <style>
            body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:transparent}
            .print-card{box-shadow: none !important}
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>`

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="flex gap-3 mt-4">
      <button onClick={downloadPdf} className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-secondary">
        Télécharger PDF
      </button>
      <button onClick={printCard} className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Imprimer
      </button>
    </div>
  )
}
