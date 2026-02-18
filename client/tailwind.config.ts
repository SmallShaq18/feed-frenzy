import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:         'var(--color-bg)',
        surface:    'var(--color-surface)',
        'surface-2':'var(--color-surface-2)',
        border:     'var(--color-border)',
        'border-loud': 'var(--color-border-loud)',

        yellow:     'var(--color-yellow)',
        coral:      'var(--color-coral)',
        cyan:       'var(--color-cyan)',
        green:      'var(--color-green)',

        primary:    'var(--color-text-primary)',
        secondary:  'var(--color-text-secondary)',
        muted:      'var(--color-text-muted)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        ui:      ['Syne', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card:         'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'glow-yellow':'var(--shadow-glow-yellow)',
        'glow-cyan':  'var(--shadow-glow-cyan)',
      },
      transitionDuration: {
        fast:   '150ms',
        normal: '250ms',
        slow:   '400ms',
      },
      animation: {
        'card-enter':  'cardEnter 300ms ease forwards',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'spin-slow':   'spin-slow 8s linear infinite',
        'fade-in':     'fadeIn 250ms ease forwards',
        'slide-up':    'slideUp 300ms ease forwards',
        shimmer:       'shimmer 1.5s infinite linear',
      },
      keyframes: {
        cardEnter: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,229,0,0)' },
          '50%':       { boxShadow: '0 0 16px 2px rgba(255,229,0,0.2)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

/** @type {import('tailwindcss').Config} 
/*export default {
  content: [
    "./index.html",
    "./src/**.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}*/