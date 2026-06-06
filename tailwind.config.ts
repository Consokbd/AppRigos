import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1AA8C5',
        secondary: '#0F4C81',
        success: '#16A34A',
        surface: '#F3FBFC',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 76, 129, 0.12)',
      },
    },
  },
  plugins: [typography],
}

export default config
