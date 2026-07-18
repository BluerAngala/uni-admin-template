import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  optimizeDeps: {
    include: ['vue-i18n'],
    force: true,
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['__f__'],
      },
    },
  },
});
