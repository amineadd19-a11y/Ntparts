/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        navy: {
          DEFAULT: '#0b1220',
          50: '#f5f7fb',
          100: '#e8ecf4',
          200: '#c5cede',
          300: '#8b9bb8',
          400: '#5a6d8f',
          500: '#3a4d6e',
          600: '#2a3a54',
          700: '#1c2a42',
          800: '#131f33',
          900: '#0b1220',
          950: '#070d16',
        },
        accent: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'nt-sm': '0 1px 2px rgba(11, 18, 32, 0.04), 0 4px 12px rgba(11, 18, 32, 0.04)',
        'nt': '0 1px 3px rgba(11, 18, 32, 0.06), 0 12px 32px rgba(11, 18, 32, 0.06)',
        'nt-lg': '0 4px 12px rgba(11, 18, 32, 0.08), 0 24px 56px rgba(11, 18, 32, 0.1)',
        'nt-glow': '0 0 0 1px rgba(14, 165, 233, 0.15), 0 8px 32px rgba(14, 165, 233, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.35s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
