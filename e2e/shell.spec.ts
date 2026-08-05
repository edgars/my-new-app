import { expect, test } from '@playwright/test'

import { entrar } from './apoio'

test.beforeEach(async ({ page }) => {
  await entrar(page)
})

test.describe('shell da aplicação', () => {
  test('a navegação lateral cobre as 8 entidades e marca a ativa', async ({ page }) => {
    await page.goto('/beneficiarios')
    const lateral = page.getByRole('navigation', { name: 'Navegação principal' })

    for (const titulo of [
      'Programas Sociais', 'Faixas de Cálculo', 'Parâmetros Regionais',
      'Beneficiários', 'Dependentes', 'Pagamentos', 'Descontos', 'Auditoria',
    ]) {
      await expect(lateral.getByRole('link', { name: titulo, exact: true })).toBeVisible()
    }

    // O item ativo se anuncia como página atual; os outros, não.
    await expect(
      lateral.getByRole('link', { name: 'Beneficiários', exact: true }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      lateral.getByRole('link', { name: 'Pagamentos', exact: true }),
    ).not.toHaveAttribute('aria-current', 'page')
  })

  test('⌘K abre a paleta e navega', async ({ page }) => {
    // Regressão: o CommandDialog do shadcn não inclui o root <Command>, e sem ele
    // o cmdk estoura em `.subscribe` ao montar o input.
    await page.goto('/beneficiarios')
    await page.keyboard.press('ControlOrMeta+k')

    const paleta = page.getByRole('dialog')
    await expect(paleta).toBeVisible()
    await expect(page.getByRole('option')).toHaveCount(9)

    await page.keyboard.type('Descontos')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/pagamento_grp_descontos$/)
  })

  test('o tema alterna e persiste na navegação', async ({ page }) => {
    await page.goto('/beneficiarios')
    const html = page.locator('html')
    const eraEscuro = (await html.getAttribute('class'))?.includes('dark') ?? false

    await page.getByRole('button', { name: 'Alternar tema' }).click()
    await expect(html).toHaveClass(eraEscuro ? /(?!.*dark)/ : /dark/)

    await page.goto('/pagamentos')
    await expect(html).toHaveClass(eraEscuro ? /(?!.*dark)/ : /dark/)
  })

  test('a busca global não colide com o filtro da listagem', async ({ page }) => {
    await page.goto('/beneficiarios')
    // Dois controles de busca na mesma tela: nomes acessíveis distintos.
    await expect(page.getByRole('button', { name: 'Busca global' })).toBeVisible()
    const filtro = page.locator('form').filter({ has: page.locator('input[name="q"]') })
    await expect(filtro.getByRole('button', { name: 'Buscar' })).toBeVisible()
  })

  test('as migalhas levam de volta à listagem', async ({ page }) => {
    await page.goto('/beneficiarios/1/edit')
    const migalhas = page.getByRole('navigation', { name: 'breadcrumb' })
    await migalhas.getByRole('link', { name: 'Beneficiários' }).click()
    await expect(page).toHaveURL(/\/beneficiarios$/)
  })
})
