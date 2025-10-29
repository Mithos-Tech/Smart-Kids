export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1AD96D',    // Verde original
        secondary: '#4F46E5',  // Índigo original
        accent: '#1AD96D',     // Verde original
        dark: '#1E293B',       // slate-800
        darker: '#0F172A',     // slate-900  
        light: '#F8FAFC',      // slate-50
        'light-gray': '#F2F2F2'
      },
      fontFamily: {
        // Agrega aquí las fuentes si las tienes definidas
      }
    },
  },
  plugins: [],
}
