import { expect, test } from '@playwright/test'

import { entrar } from './apoio'

test.beforeEach(async ({ page }) => {
  await entrar(page)
})

test('ciclo completo de Programa Social: criar, listar, editar, excluir', async ({ page }) => {
  const codigo = `E2E${Date.now().toString().slice(-6)}`

  // criar
  await page.goto('/programa_socials/new')
  await page.fill('input[name="codPrograma"]', codigo)
  await page.fill('input[name="nomePrograma"]', 'Programa E2E')
  await page.fill('input[name="vlrBaseIndividual"]', '750.50')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page).toHaveURL(/\/programa_socials$/)

  // aparece na lista, com o valor formatado como moeda
  const linha = page.getByRole('row').filter({ hasText: codigo })
  await expect(linha).toBeVisible()
  await expect(linha).toContainText('Programa E2E')
  await expect(linha).toContainText('R$ 750,50')

  // editar
  await linha.getByRole('link', { name: 'Editar' }).click()
  await expect(page.getByRole('heading', { name: /Editar Programa Social/ })).toBeVisible()
  await page.fill('input[name="nomePrograma"]', 'Programa E2E alterado')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await expect(page).toHaveURL(/\/programa_socials$/)
  await expect(page.getByRole('row').filter({ hasText: codigo })).toContainText(
    'Programa E2E alterado',
  )

  // excluir — aceitando o confirm() do navegador
  await page.getByRole('row').filter({ hasText: codigo }).getByRole('link', { name: 'Editar' }).click()
  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Excluir' }).click()
  await expect(page).toHaveURL(/\/programa_socials$/)
  await expect(page.getByRole('row').filter({ hasText: codigo })).toHaveCount(0)
})

test('busca filtra a listagem e o contador acompanha', async ({ page }) => {
  await page.goto('/beneficiarios')
  await expect(page.getByText('5 registro(s)')).toBeVisible()

  // Escopado ao formulário da lista: o topo tem a busca global (⌘K), que agora
  // se chama "Busca global" justamente para não colidir com este botão.
  const filtro = page.locator('form').filter({ has: page.locator('input[name="q"]') })
  await page.fill('input[name="q"]', 'Silva')
  await filtro.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByText('1 registro(s)')).toBeVisible()

  await page.fill('input[name="q"]', 'zzzz-nao-existe')
  await filtro.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.getByText('0 registro(s)')).toBeVisible()
  await expect(page.getByText('Nenhum registro.')).toBeVisible()
})

test('listagem mostra a seleção curada de colunas, não os 45 campos (D-03)', async ({ page }) => {
  await page.goto('/beneficiarios')
  const cabecalhos = page.getByRole('columnheader')
  // 6 colunas de dado + 1 vazia para o link de editar.
  await expect(cabecalhos).toHaveCount(7)
  await expect(cabecalhos.nth(0)).toHaveText('Num Inscricao')
  await expect(cabecalhos.nth(2)).toHaveText('Nome Completo')
})
