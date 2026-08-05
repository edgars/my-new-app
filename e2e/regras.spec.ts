import { expect, test } from '@playwright/test'

import { entrar } from './apoio'

test.beforeEach(async ({ page }) => {
  await entrar(page)
})

test.describe('regras do legado, na tela', () => {
  test('FR-12/13/14 bloqueiam e a mensagem aparece no campo certo', async ({ page }) => {
    await page.goto('/beneficiarios/new')
    await page.fill('input[name="numCpf"]', '111.444.777-35')
    await page.fill('input[name="nomeCompleto"]', 'Teste Regra')
    await page.fill('input[name="dtNascimento"]', '1990-05-10')
    await page.fill('input[name="sexo"]', 'X') // FR-14
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/beneficiarios\/new/)
    await expect(page.getByText("Sexo deve ser 'M' ou 'F'.")).toBeVisible()
    await expect(page.locator('input[name="sexo"]')).toHaveAttribute('aria-invalid', 'true')
  })

  test('FR-11 rejeita CPF com dígito verificador errado', async ({ page }) => {
    await page.goto('/beneficiarios/new')
    await page.fill('input[name="numCpf"]', '111.444.777-99')
    await page.fill('input[name="nomeCompleto"]', 'CPF Ruim')
    await page.fill('input[name="dtNascimento"]', '1990-05-10')
    await page.fill('input[name="sexo"]', 'M')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText(/dígito verificador não confere/)).toBeVisible()
  })

  test('FR-15 impede incluir CPF que já existe', async ({ page }) => {
    await page.goto('/beneficiarios/new')
    await page.fill('input[name="numCpf"]', '111.444.777-35') // já vem do seed
    await page.fill('input[name="nomeCompleto"]', 'Duplicado')
    await page.fill('input[name="dtNascimento"]', '1990-05-10')
    await page.fill('input[name="sexo"]', 'M')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Já existe beneficiário com este CPF.')).toBeVisible()
  })

  test('FR-19 avisa acima de 75 anos sem bloquear', async ({ page }) => {
    await page.goto('/beneficiarios')
    await page
      .getByRole('row')
      .filter({ hasText: 'Sebastião' })
      .getByRole('link', { name: 'Editar' })
      .click()

    await expect(page.getByText(/acima do limite de 75/)).toBeVisible()

    // Aviso, não erro: salvar continua funcionando.
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page).toHaveURL(/\/beneficiarios$/)
  })
})

test.describe('painel de cálculo do Pagamento', () => {
  test('INV-32: o teto de 30% aparece, corta e o total para no teto', async ({ page }) => {
    await page.goto('/pagamentos')
    await page
      .getByRole('row')
      .filter({ hasText: '900003' })
      .getByRole('link', { name: 'Editar' })
      .click()

    await expect(page.getByRole('heading', { name: 'Cálculo' })).toBeVisible()
    await expect(page.getByText('Teto de 30% do bruto (INV-32):')).toBeVisible()
    // exact: o mesmo texto aparece na lista de leituras adotadas logo abaixo.
    await expect(page.getByText('Teto de 30% acionado', { exact: true })).toBeVisible()

    // Pensão alimentícia é preservada; sindical e judicial são cortados.
    const pensao = page.getByRole('row').filter({ hasText: 'Pensão alimentícia' })
    await expect(pensao).not.toContainText('cortado pelo teto')
    await expect(page.getByRole('row').filter({ hasText: 'Sindical' })).toContainText(
      'cortado pelo teto',
    )

    // O total para exatamente no teto.
    await expect(page.getByRole('row').filter({ hasText: 'Total' })).toContainText('R$ 300,00')
    await expect(page.getByText('Líquido calculado (INV-33)')).toBeVisible()
  })

  test('INV-24: pagamento de junho não tem 13º nem abono', async ({ page }) => {
    await page.goto('/pagamentos')
    await page
      .getByRole('row')
      .filter({ hasText: '900002' })
      .getByRole('link', { name: 'Editar' })
      .click()

    // dt/dd: o valor é o irmão imediato do termo, não texto concatenado num div.
    const valorDe = (termo: string) =>
      page.getByRole('term').filter({ hasText: termo }).locator('+ dd')

    await expect(valorDe('13º salário (INV-24)')).toHaveText('R$ 0,00')
    await expect(valorDe('Abono natalino 15% (INV-23)')).toHaveText('R$ 0,00')

    // E o teto de 30% não é acionado neste pagamento — contraprova do outro teste.
    await expect(page.getByText('Teto de 30% acionado', { exact: true })).toHaveCount(0)
  })

  test('as leituras adotadas ficam visíveis na própria tela', async ({ page }) => {
    await page.goto('/pagamentos')
    await page
      .getByRole('row')
      .filter({ hasText: '900003' })
      .getByRole('link', { name: 'Editar' })
      .click()

    await page.getByText(/leitura\(s\) adotada\(s\) neste cálculo/).click()
    await expect(page.getByText(/FATOR-IDADE neutro/)).toBeVisible()
    await expect(page.getByText(/ordem de corte é leitura adotada/)).toBeVisible()
  })
})
