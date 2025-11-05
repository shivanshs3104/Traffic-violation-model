import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // YEH LINE ADD KAREIN:
  // 'ai-traffic-react' ko apne GitHub repository ke naam se badal dein
  base: '/Traffic-violation-model/', 
})