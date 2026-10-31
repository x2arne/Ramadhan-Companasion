/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Netral: hijau lembut (skala terbalik: 50 = teks tergelap, 950 = latar terang)
        ink: {
          50: '#111b0d', 100: '#1d2a17', 200: '#2f3f27', 300: '#44563a', 400: '#566a4a',
          500: '#7f9270', 600: '#aebf9d', 700: '#d3e0c3', 800: '#e8f0dd', 900: '#ffffff', 950: '#f4f8ef',
        },
        // Satu-satunya aksen: kuning hangat
        accent: {
          50: '#fdf8e8', 100: '#faefc4', 200: '#f5df8c', 300: '#eecb57', 400: '#e3b23a',
          500: '#cf9a24', 600: '#ae7a1b', 700: '#8a5c19', 800: '#724a1b', 900: '#5f3d1a', 950: '#371f0a',
        },
        background: { DEFAULT: '#f4f8ef', darker: '#e8f0dd', lighter: '#f9fcf5' },
        surface: {
          DEFAULT: '#ffffff',
          card: '#ffffff',
          elevated: '#f0f6e8',
          border: 'rgba(47, 63, 39, 0.16)',
          'border-active': 'rgba(174, 122, 27, 0.6)',
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
