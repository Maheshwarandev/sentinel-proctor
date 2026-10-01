/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        surface: {
          base: '#080c14',
          raised: '#0d1320',
          card: '#111827',
          elevated: '#161f2e',
          border: 'rgba(255,255,255,0.07)',
        },
        // Brand accent
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#22d3ee',
          muted: 'rgba(6,182,212,0.12)',
          border: 'rgba(6,182,212,0.3)',
        },
        // Status colors
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
        // Legacy brother tokens (keep for backward compat)
        brother: {
          900: '#080c14',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          accent: '#06b6d4',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        'page': ['1.5rem', { lineHeight: '2rem', fontWeight: '800' }],
        'section': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'card-title': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'secondary': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      spacing: {
        'sidebar': '240px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5)',
        'accent': '0 0 20px rgba(6,182,212,0.2)',
        'danger': '0 0 20px rgba(239,68,68,0.2)',
      }
    },
  },
  plugins: [],
}
