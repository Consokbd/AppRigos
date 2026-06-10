'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useState } from 'react'

interface CardActionsProps {
  agentId: string
}

export default function CardActions({ agentId }: CardActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function waitForExportAssets(root: HTMLElement) {
    await document.fonts?.ready

    const images = Array.from(root.querySelectorAll('img'))
    await Promise.all(
      images.map(async (image) => {
        const src = image.getAttribute('src')
        if (src && src.startsWith('/')) {
          image.src = new URL(src, window.location.origin).toString()
        }

        if (!image.complete || image.naturalWidth === 0) {
          await new Promise<void>((resolve) => {
            image.onload = () => resolve()
            image.onerror = () => resolve()
          })
        }

        await image.decode?.().catch(() => undefined)
      }),
    )
  }

  async function downloadPdf() {
    if (isGenerating) return

    const cardElement = document.getElementById('service-card')
    if (!cardElement) return

    setIsGenerating(true)

    const exportHost = document.createElement('div')
    const exportCard = cardElement.cloneNode(true) as HTMLElement

    exportHost.className = 'rigos-export-host'
    exportCard.id = 'service-card-export'
    exportCard.classList.add('rigos-exporting')
    exportHost.appendChild(exportCard)
    document.body.appendChild(exportHost)

    try {
      await waitForExportAssets(exportCard)
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const canvas = await html2canvas(exportCard, {
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
      exportHost.remove()
      setIsGenerating(false)
    }
  }

  function printCard() {
    window.print()
  }

  return (
    <div className="card-actions-center">
      <button type="button" onClick={downloadPdf} disabled={isGenerating} className="btn-primary px-5 py-3 disabled:cursor-wait disabled:opacity-70">
        {isGenerating ? 'Preparation...' : 'Telecharger PDF'}
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
