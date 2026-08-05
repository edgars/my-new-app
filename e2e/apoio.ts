import type { Page } from '@playwright/test'

export async function entrar(page: Page, login = 'admin', senha = 'admin123') {
  await page.goto('/login')
  await page.fill('input[name="login"]', login)
  await page.fill('input[name="senha"]', senha)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'))
}
