import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vitest-canvas-mock'],
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
