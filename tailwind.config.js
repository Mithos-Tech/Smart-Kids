export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399'
        },
        secondary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa'
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
