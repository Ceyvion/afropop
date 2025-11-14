/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['var(--font-dm-sans)'],
        'display-condensed': ['var(--font-display-condensed)'],
        'body': ['var(--font-inter)'],
        'mono': ['var(--font-ibm-plex-mono)'],
      },
      colors: {
        'ink': '#0B0B0C',
        'paper': '#FFFFFF',
        // Brand accents per spec
        'accent': '#FF5A2F',
        'accent-2': '#1460F2',
        'accent-50': '#FFF3ED',
        'accent-100': '#FFE6DC',
        'success': '#18A957',
        'warn': '#E7A500',
        // Poster palette (solid, pop-art)
        'poster-mustard': '#E0B500',
        'poster-sky': '#60A5FA',
        'poster-coral': '#FF6B57',
        'poster-lilac': '#C084FC',
        'canvas': '#F3F4F6',
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
}
