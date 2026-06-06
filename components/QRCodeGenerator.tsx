'use client'

import QRCode from 'react-qr-code'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  label?: string
}

export default function QRCodeGenerator({ value, size = 150, label }: QRCodeGeneratorProps) {
  const isDataUrl = value.startsWith('data:image/')

  return (
    <div className="qr-generator">
      {isDataUrl ? (
        <img src={value} alt="QR Code" width={size} height={size} className="max-w-full" />
      ) : (
        <QRCode value={value} size={size} bgColor="#ffffff" fgColor="#0F4C81" />
      )}
      {label && <p className="text-center text-sm font-medium text-slate-600">{label}</p>}
    </div>
  )
}
