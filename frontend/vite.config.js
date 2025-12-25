import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  theme: {
    extend: {
      colors: {
        // Palette "L'After Scent" - Premium & Elegan
        primary: '#1A1A1A',      // Hitam Arang (Main Text/Bg)
        secondary: '#D4AF37',    // Emas/Gold (Accent/Button)
        accent: '#F5F5F5',       // Off-White (Background Section)
        muted: '#8E8E93',        // Abu-abu (Secondary Text)
      },
      fontFamily: {
        // Kita akan set font nanti (rekomendasi: Playfair Display untuk Headings)
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [react(), 
    tailwindcss(),],
})
