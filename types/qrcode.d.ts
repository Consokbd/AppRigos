declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    margin?: number
    width?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>

  namespace QRCode {
    export { toDataURL }
  }

  export default QRCode
}
