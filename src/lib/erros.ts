/** Erros de aplicação que a borda HTTP sabe traduzir em status. */

export class NaoAutorizado extends Error {
  readonly status = 401
  constructor(mensagem = 'Autenticação obrigatória.') {
    super(mensagem)
    this.name = 'NaoAutorizado'
  }
}

export class Proibido extends Error {
  readonly status = 403
  constructor(mensagem = 'Sem permissão para esta operação.') {
    super(mensagem)
    this.name = 'Proibido'
  }
}

export class NaoEncontrado extends Error {
  readonly status = 404
  constructor(mensagem = 'Registro não encontrado.') {
    super(mensagem)
    this.name = 'NaoEncontrado'
  }
}

export class DadosInvalidos extends Error {
  readonly status = 422
  constructor(
    mensagem = 'Dados inválidos.',
    readonly problemas: { campo: string | null; mensagem: string }[] = [],
  ) {
    super(mensagem)
    this.name = 'DadosInvalidos'
  }
}

export function statusDoErro(erro: unknown): number {
  if (erro instanceof NaoAutorizado) return 401
  if (erro instanceof Proibido) return 403
  if (erro instanceof NaoEncontrado) return 404
  if (erro instanceof DadosInvalidos) return 422
  return 500
}
