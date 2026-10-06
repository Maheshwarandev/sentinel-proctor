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
          base: '#080C14',
          raised: '#0F1623',
          elevated: '#151E2D',
            card: '#0a0f18',
          border: '#243044',
        },
        // Brand accents
        accent: {
          DEFAULT: '#22D3EE',
          hover: '#06B6D4',
          muted: 'rgba(34, 211, 238, 0.12)',
          border: 'rgba(34, 211, 238, 0.3)',
        },
        ai: {
          DEFAULT: '#8B5CF6',
          muted: 'rgba(139, 92, 246, 0.12)',
          border: 'rgba(139, 92, 246, 0.3)',
        },
        // Status colors
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        // Muted text colors
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        // Legacy brother tokens (keep for backward compat)
        brother: {
          900: '#080C14',
          800: '#0F1623',
          700: '#151E2D',
          600: '#243044',
          accent: '#22D3EE',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#22C55E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      fontSize: {
        'page': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'section': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'card-title': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'secondary': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      spacing: {
        'sidebar': '250px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5)',
        'accent': '0 0 20px rgba(34, 211, 238, 0.15)',
        'danger': '0 0 20px rgba(239, 68, 68, 0.15)',
      }
    },
  },
  plugins: [],
}
