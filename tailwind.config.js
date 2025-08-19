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
        'body': ['var(--font-inter)'],
        'mono': ['var(--font-ibm-plex-mono)'],
      },
      colors: {
        'ink': '#0B0B0C',
        'paper': '#FFFFFF',
        'accent': '#228B22', // Forest Green
        'accent-2': '#228B22', // Forest Green (same as accent)
        'accent-50': '#f0f9f0', // Light green for backgrounds
        'accent-100': '#e1f3e1', // Light green for backgrounds
        'success': '#18A957',
        'warn': '#E7A500',
        // Neutral colors would be defined here if needed
      },
    },
  },
  plugins: [],
}
