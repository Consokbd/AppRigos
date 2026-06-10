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

    cardElement.classList.add('rigos-exporting')
    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#F6F6F6',
        scale: 3,
        useCORS: true,
        width: 1120,
        height: 706,
        windowWidth: 1120,
        windowHeight: 706,
      })
      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
      pdf.addImage(imageData, 'PNG', 0, 0, 85.6, 54)
      pdf.save(`carte-${agentId}.pdf`)
    } finally {
      cardElement.classList.remove('rigos-exporting')
    }
  }

  function printCard() {
    window.print()
  }

  return (
    <div className="card-actions-center">
      <button type="button" onClick={downloadPdf} className="btn-primary px-5 py-3">
        Telecharger PDF
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
