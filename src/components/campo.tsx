'use client'

import type { CampoSpec } from '@/lib/entidades'
import { paraInput, tipoDoInput } from '@/lib/formatar'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Um campo do formulário.
 *
 * O controle vem do `componente` derivado em `src/lib/entidades.ts` (S-06):
 * `DESIGN.md` marcava `input` para os 45 campos, o que não é decisão de UX —
 * `dtNascimento` e `indBiometria` não são o mesmo controle.
 */

/** Dica exibida sob o campo, quando a semântica não é óbvia pelo rótulo. */
const DICAS: Record<string, string> = {
  numCpf: 'Somente números ou com pontuação — validado por dígito verificador.',
  dtNascimento: 'Usada no cálculo da idade e no limite de 75 anos.',
  numVersao: 'Controle de concorrência. Preenchido pelo sistema.',
  anoMesRef: 'Competência no formato AAAAMM. Dezembro paga 13º e abono.',
  tipoPrograma: "Programas do tipo 'A' recebem abono natalino de 15%.",
  pctDesconto: 'Percentual sobre o valor bruto. Ignorado se houver valor fixo.',
  vlrDesconto: 'Valor fixo. Tem precedência sobre o percentual.',
  indAcumulativo: "Com 'Sim', acumula todas as faixas até a renda do beneficiário.",
  indAtivoRegiao: 'Só regiões ativas entram no cálculo.',
}

/** Campos que ocupam a linha inteira por serem longos. */
const LARGURA_TOTAL = new Set([
  'nomePrograma',
  'orgaoResponsavel',
  'nomeCompleto',
  'nomeMae',
  'nomePai',
  'logradouro',
  'desAcao',
  'desErroBatch',
  'hashDigital',
  'hashArqRemessa',
  'hashArqRetorno',
  'motCancelamento',
  'desRetornoBanco',
  'nomeDependente',
])

export function Campo({
  campo,
  valor,
  erro,
  somenteLeitura,
}: {
  campo: CampoSpec
  valor: unknown
  erro?: string
  somenteLeitura?: boolean
}) {
  const id = `campo-${campo.nome}`
  const dica = DICAS[campo.nome]
  const inicial = paraInput(campo, valor)

  return (
    <div className={cn('flex flex-col gap-2', LARGURA_TOTAL.has(campo.nome) && 'sm:col-span-2')}>
      <Label htmlFor={id}>
        {campo.rotulo}
        {campo.obrigatorio ? (
          <span aria-hidden className="text-destructive">
            *
          </span>
        ) : null}
      </Label>

      {campo.componente === 'indicador' ? (
        <Select name={campo.nome} defaultValue={String(valor ?? '')}>
          <SelectTrigger id={id} aria-invalid={erro ? true : undefined} className="w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="S">Sim</SelectItem>
            <SelectItem value="N">Não</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={campo.nome}
          type={tipoDoInput(campo)}
          step={
            campo.componente === 'moeda' || campo.componente === 'percentual'
              ? '0.01'
              : undefined
          }
          defaultValue={inicial}
          readOnly={somenteLeitura}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : dica ? `${id}-dica` : undefined}
          placeholder={campo.componente === 'moeda' ? '0,00' : undefined}
        />
      )}

      {erro ? (
        <p id={`${id}-erro`} className="text-xs text-destructive">
          {erro}
        </p>
      ) : dica ? (
        <p id={`${id}-dica`} className="text-xs text-muted-foreground">
          {dica}
        </p>
      ) : null}
    </div>
  )
}
