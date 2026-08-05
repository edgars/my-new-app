import { expect, test } from '@playwright/test'

test.describe('autenticação fail-closed', () => {
  test('rota protegida sem sessão manda para o login guardando o destino', async ({ page }) => {
    await page.goto('/beneficiarios')
    await expect(page).toHaveURL(/\/login\?de=%2Fbeneficiarios/)
  })

  test('credencial errada não entra e não revela se o login existe', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="login"]', 'admin')
    await page.fill('input[name="senha"]', 'senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    const alerta = page.getByRole('alert').filter({ hasText: 'inválidos' })
    await expect(alerta).toHaveText('Login ou senha inválidos.')

    // Mesma mensagem para usuário inexistente: distinguir entregaria a lista de logins.
    await page.fill('input[name="login"]', 'nao-existe')
    await page.fill('input[name="senha"]', 'qualquer')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'inválidos' })).toHaveText(
      'Login ou senha inválidos.',
    )
  })

  test('login válido entra e volta para o destino guardado', async ({ page }) => {
    await page.goto('/pagamentos')
    await expect(page).toHaveURL(/\/login/)

    await page.fill('input[name="login"]', 'admin')
    await page.fill('input[name="senha"]', 'admin123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/pagamentos$/)
    await expect(page.getByRole('heading', { name: 'Pagamentos' })).toBeVisible()
  })

  test('sair encerra a sessão', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="login"]', 'admin')
    await page.fill('input[name="senha"]', 'admin123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/')

    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/beneficiarios')
    await expect(page).toHaveURL(/\/login/)
  })
})
