import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/fem_034_todo-app_firebase',
  plugins: [react()],
});
