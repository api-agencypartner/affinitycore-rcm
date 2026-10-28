import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         -> multi-file build for GitHub Pages (images load in parallel, faster first paint)
// `SINGLE=1 npm run build` -> one self-contained dist/index.html (review link)
const single = !!process.env.SINGLE;
export default defineConfig({
  base: './',
  plugins: single ? [react(), viteSingleFile()] : [react()],
  build: single ? { assetsInlineLimit: 100_000_000 } : {},
});
