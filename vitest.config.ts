import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'server-only': fileURLToPath(
        new URL('./tests/setup/server-only-stub.ts', import.meta.url),
      ),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Os testes de concorrência abrem o mesmo arquivo SQLite; rodar arquivos em
    // paralelo criaria contenção entre suítes e mascararia o que está sendo medido.
    fileParallelism: false,
  },
})
