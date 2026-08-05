import { expect, test } from '@playwright/test'

import { entrar } from './apoio'

/**
 * O que teste de unidade não pega: a rota realmente exposta pelo servidor.
 */

test('API nega mutação sem sessão — 401, não 200 nem 500', async ({ request }) => {
  for (const chamada of [
    { method: 'post' as const, url: '/api/beneficiarios' },
    { method: 'put' as const, url: '/api/beneficiarios/1' },
    { method: 'delete' as const, url: '/api/beneficiarios/1' },
    { method: 'post' as const, url: '/api/programa_socials' },
    { method: 'delete' as const, url: '/api/auditorias/1' },
  ]) {
    const r = await request[chamada.method](chamada.url, { data: {} })
    expect(r.status(), `${chamada.method.toUpperCase()} ${chamada.url}`).toBe(401)
  }
})

test('API nega leitura sem sessão', async ({ request }) => {
  const r = await request.get('/api/beneficiarios')
  expect(r.status()).toBe(401)
  expect(await r.json()).toEqual({ erro: 'Autenticação obrigatória.' })
})

test('campo de servidor não pode ser forjado pelo cliente', async ({ page, request }) => {
  await entrar(page)
  const cookies = await page.context().cookies()
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ')

  const criar = await request.post('/api/beneficiarios', {
    headers: { cookie },
    data: {
      numCpf: '98765432100',
      nomeCompleto: 'Forja E2E',
      dtNascimento: '1990-05-10',
      sexo: 'M',
      usrInclusao: 'FORJADO',
    },
  })
  expect(criar.status()).toBe(201)
  const { id } = await criar.json()

  const lido = await request.get(`/api/beneficiarios/${id}`, { headers: { cookie } })
  const registro = await lido.json()
  // O usuário vem da sessão, nunca do corpo da requisição.
  expect(registro.usrInclusao).toBe('admin')
  expect(registro.usrInclusao).not.toBe('FORJADO')

  await request.delete(`/api/beneficiarios/${id}`, { headers: { cookie } })
})

test('exclusão confirma no servidor, não no diálogo', async ({ page, request }) => {
  await entrar(page)
  const cookies = await page.context().cookies()
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ')

  // DELETE direto, sem passar por tela nem por confirm(): o servidor decide.
  const inexistente = await request.delete('/api/programa_socials/999999', {
    headers: { cookie },
  })
  expect(inexistente.status()).toBe(404)

  // E sem sessão, nem chega a olhar o registro.
  const semSessao = await request.delete('/api/programa_socials/1')
  expect(semSessao.status()).toBe(401)
})

test('trava otimista: alteração com versão obsoleta é recusada', async ({ page, request }) => {
  await entrar(page)
  const cookies = await page.context().cookies()
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ')

  const corpo = (versao: number, nome: string) => ({
    numCpf: '11144477735',
    nomeCompleto: nome,
    dtNascimento: '1985-03-12',
    sexo: 'F',
    numVersao: versao,
  })

  const primeira = await request.put('/api/beneficiarios/1', {
    headers: { cookie },
    data: corpo(1, 'Primeira alteração'),
  })
  expect(primeira.status()).toBe(200)

  const segunda = await request.put('/api/beneficiarios/1', {
    headers: { cookie },
    data: corpo(1, 'Segunda alteração'),
  })
  expect(segunda.status()).toBe(422)
  const erro = await segunda.json()
  expect(erro.problemas[0].mensagem).toContain('alterado por outra pessoa')
})
