'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface CardActionsProps {
  agentId: string
}

export default function CardActions({ agentId }: CardActionsProps) {
  async function downloadPdf() {
    const cardElement = document.getElementById('service-card')
    if (!cardElement) return

    const canvas = await html2canvas(cardElement, { backgroundColor: '#ffffff', scale: 2 })
    const imageData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
    pdf.addImage(imageData, 'PNG', 0, 0, 85.6, 54)
    pdf.save(`carte-${agentId}.pdf`)
  }

  function printCard() {
    const printWindow = window.open('', '_blank', 'width=900,height=600')
    if (!printWindow) return

    const cardHtml = document.getElementById('service-card')?.outerHTML
    if (!cardHtml) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Impression carte de service</title>
          <style>
            body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#f8fafc}
            #service-card{width:85.6mm;height:54mm;}
          </style>
        </head>
        <body>${cardHtml}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="card-actions-center">
      <button
        type="button"
        onClick={downloadPdf}
        className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
      >
        Télécharger PDF
      </button>
      <button
        type="button"
        onClick={printCard}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Imprimer la carte
      </button>
    </div>
  )
}
