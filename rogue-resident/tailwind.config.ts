import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Node type colors from design document
        'clinical': '#4A90E2',  // Medical blue
        'qa': '#5A6978',        // Technical gray
        'educational': '#26A69A', // Learning green
        'storage': '#D8CCA3',   // Dusty beige
        'vendor': '#2C3E50',    // Professional navy
        'boss': '#4FC3F7',      // Energy blue
        
        // Accent colors
        'clinical-accent': '#F4D03F', // Safety yellow
        'qa-accent': '#E53E3E',       // Calibration red
        'educational-accent': '#FFD54F', // Highlight yellow
      },
      fontFamily: {
        'pixel': ['VT323', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      // For pixel-perfect 8-bit style
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

export default config