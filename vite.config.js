import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['vanta', 'three'], // Pastikan vanta dan three dioptimalkan
  },
  // Jika diperlukan, tambahkan pengaturan lainnya
});
