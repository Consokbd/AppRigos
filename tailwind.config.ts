import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#159CAF',
        secondary: '#05070A',
        success: '#16A34A',
        surface: '#F1FBFC',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(21, 156, 175, 0.14)',
      },
    },
  },
  plugins: [typography],
}

export default config
