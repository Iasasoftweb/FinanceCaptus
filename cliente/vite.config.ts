// Cliente/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// export default defineConfig({
//   server: {
//     host: true,
//     port: 5173,
//     watch: {
//       usePolling: true,
//       interval: 1000, // Revisa cada 1 segundo, no cada milisegundo
//       ignored: ['**/node_modules/**', '**/dist/**'], // <--- ESTO ES VITAL
//     },
//   },
// })

    // export default defineConfig({
    //   plugins: [react()],
    //   server: {
    //     host: "0.0.0.0", // Forzamos IP local clásica en lugar de 0.0.0.0 o [::]
    //     port: 5174,
    //     strictPort: true,
    //     watch: {
    //       usePolling: true,
    //     },
    //     hmr: {
    //     clientPort: 5174,
    //   },
    //   },
    // });
export default defineConfig({
  plugins: [react()],
 server: {
  host: '0.0.0.0',
  port: 5174,
  
},
 
})