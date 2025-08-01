/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Werewolf theme colors from shared design tokens
        moonlight: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        blood: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        shadow: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        }
      },
      fontFamily: {
        display: ['"Cinzel"', '"Trajan Pro"', 'serif'],
        body: ['"Inter"', '"Segoe UI"', '"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Courier New"', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'moon-glow': 'moon-glow 4s ease-in-out infinite alternate',
        'blood-pulse': 'blood-pulse 2s ease-in-out infinite',
        'forest-sway': 'forest-sway 6s ease-in-out infinite',
        'shadow-flicker': 'shadow-flicker 3s ease-in-out infinite',
        'transform': 'transform 0.8s ease-in-out',
        'transformation-glow': 'transformation-glow 2s ease-in-out infinite',
        'loading-pulse': 'loading-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'moon-glow': {
          '0%': {
            boxShadow: '0 0 20px rgba(203, 213, 225, 0.5)',
            transform: 'scale(1)'
          },
          '100%': {
            boxShadow: '0 0 40px rgba(203, 213, 225, 0.8)',
            transform: 'scale(1.05)'
          }
        },
        'blood-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.02)'
          }
        },
        'forest-sway': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(2px)' }
        },
        'shadow-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'transform': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)'
          },
          '50%': {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'brightness(1.2)'
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)'
          }
        },
        'transformation-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
            filter: 'brightness(1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
            filter: 'brightness(1.1) saturate(1.2)'
          }
        },
        'loading-pulse': {
          '0%, 100%': {
            opacity: '0.3',
            background: 'linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.4), transparent)'
          },
          '50%': {
            opacity: '0.6',
            background: 'linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.8), transparent)'
          }
        }
      },
      backgroundImage: {
        'gradient-moon': 'linear-gradient(135deg, #64748b, #cbd5e1)',
        'gradient-blood': 'linear-gradient(135deg, #dc2626, #f87171)',
        'gradient-forest': 'linear-gradient(135deg, #16a34a, #4ade80)',
        'gradient-shadow': 'linear-gradient(135deg, #27272a, #71717a)',
      }
    },
  },
  plugins: [],
}