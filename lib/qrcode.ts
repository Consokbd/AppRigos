import QRCode from 'qrcode'

export async function createQRCode(url: string) {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 280,
    color: {
      dark: '#0F4C81',
      light: '#ffffff',
    },
  })
}
