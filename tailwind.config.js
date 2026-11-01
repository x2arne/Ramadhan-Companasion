/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Netral lewat CSS variable: terang (hijau lembut) dan gelap (biru malam). 50 = teks, 950 = latar.
        ink: {
          50: 'rgb(var(--ink-50) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          950: 'rgb(var(--ink-950) / <alpha-value>)',
        },
        // Satu-satunya aksen: kuning hangat
        accent: {
          50: '#fdf8e8', 100: '#faefc4', 200: '#f5df8c', 300: '#eecb57', 400: '#e3b23a',
          500: '#cf9a24', 600: '#ae7a1b', 700: 'rgb(var(--accent-700) / <alpha-value>)', 800: 'rgb(var(--accent-800) / <alpha-value>)', 900: '#5f3d1a', 950: '#371f0a',
        },
        background: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          darker: 'rgb(var(--bg-darker) / <alpha-value>)',
          lighter: 'rgb(var(--bg-lighter) / <alpha-value>)',
        },
        'on-accent': '#111b0d',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          card: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          border: 'rgb(var(--border) / 0.16)',
          'border-active': 'rgb(var(--accent-ring) / 0.6)',
        },
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
      },
    },
  },
  plugins: [],
}
