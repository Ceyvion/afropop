/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        'display-condensed': ['var(--font-display-condensed)', 'sans-serif'],
        'body': ['var(--font-outfit)', 'var(--font-archivo)', 'sans-serif'],
        'editorial': ['var(--font-archivo)', 'sans-serif'],
        'mono': ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        'ink': '#0B0B0C',
        'paper': '#FFFFFF',
        'accent': '#FF5A2F',
        'accent-v': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-2': '#1460F2',
        'accent-50': '#FFF3ED',
        'accent-100': '#FFE6DC',
        'success': '#18A957',
        'warn': '#E7A500',
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
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}
