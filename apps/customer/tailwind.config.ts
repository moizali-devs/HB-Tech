import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#22d3ee',  // cyan-400 — matches the "Setup." glow exactly
          light: '#67e8f9',    // cyan-300
          dark: '#06b6d4',     // cyan-500
          foreground: '#000000',
        },
        hb: {
          bg: '#080808',
          surface: '#111111',
          surface2: '#1a1a1a',
          border: '#1f1f1f',
          border2: '#2a2a2a',
          muted: '#52525b',
          text: '#fafafa',
          'text-2': '#a1a1aa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
        'card-md': '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        'glow-red': '0 0 0 1px rgba(34,211,238,0.5), 0 0 24px rgba(34,211,238,0.15)',
        'glow-red-sm': '0 0 0 1px rgba(34,211,238,0.35), 0 0 12px rgba(34,211,238,0.1)',
        'btn-red': '0 4px 14px rgba(34,211,238,0.25), 0 2px 6px rgba(34,211,238,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
