import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ["@arcgis/core"], // Evita problemas con la importación de módulos ES
  },
  /*define: {
    "process.env": {}, // Evita errores con variables de entorno en ArcGIS
  },*/
  server: {
    port: 5173, // Puerto de desarrollo
  },
})
