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

    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const widthMm = canvas.width * 0.264583
    const heightMm = canvas.height * 0.264583

    const pdf = new jsPDF({
      orientation: widthMm > heightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm)
    pdf.save(`fiche-agent-${agentId}.pdf`)
  }

  function printCard() {
    const el = document.getElementById('agent-profile-card')
    if (!el) return

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression - Fiche agent</title>
          <style>
            body{margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif}
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" onClick={downloadPdf} className="btn-primary px-5 py-3">
        Telecharger la fiche
      </button>
      <button
        type="button"
        onClick={printCard}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Imprimer
      </button>
    </div>
  )
}
