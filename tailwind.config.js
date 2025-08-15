/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'accent': '#FF5A2F',
        'accent-2': '#1460F2',
        'success': '#18A957',
        'warn': '#E7A500',
        // Neutral colors would be defined here if needed
      },
    },
  },
  plugins: [],
}