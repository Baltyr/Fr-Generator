/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema oscuro personalizado
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a2e',
          input: '#252542',
        },
        border: {
          DEFAULT: '#353560',
          focus: '#8b5cf6',
        },
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        accent: {
          purple: '#8b5cf6',
          'purple-hover': '#7c3aed',
          blue: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        error: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'purple': '0 4px 12px rgba(139, 92, 246, 0.4)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
