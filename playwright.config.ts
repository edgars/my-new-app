import { defineConfig, devices } from '@playwright/test'

const PORTA = 3210
const BANCO = 'file:./prisma/e2e.db'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  // Suíte compartilha um banco: um teste que altera registro que outro precisa
  // quebra conforme a ordem alfabética dos arquivos. Um worker elimina isso.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Migração e seed encadeados no próprio comando do servidor. Em globalSetup
    // a ordem não é garantida: o health check bate em '/' antes do banco existir
    // e o resultado é timeout com "no such table" em loop.
    // O banco E2E é artefato de teste, recriado do zero a cada execução: remove
    // o arquivo e aplica as migrations. `migrate deploy` é o mesmo comando de
    // produção — nada de `db push --force-reset`, que é destrutivo por natureza.
    // O caminho é fixo e não toca em dev.db.
    command: [
      'rm -f prisma/e2e.db prisma/e2e.db-journal prisma/e2e.db-wal prisma/e2e.db-shm',
      `DATABASE_URL="${BANCO}" pnpm db:migrate`,
      `DATABASE_URL="${BANCO}" pnpm db:seed`,
      `DATABASE_URL="${BANCO}" pnpm dev -p ${PORTA}`,
    ].join(' && '),
    url: `http://localhost:${PORTA}/login`,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
