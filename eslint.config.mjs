import next from 'eslint-config-next'

const config = [
  {
    ignores: [
      'src/generated/**',
      '.claude/**',
      '_bmad/**',
      '.next/**',
      'node_modules/**',
      'prisma/migrations/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...next,
  {
    rules: {
      // A regra que sustenta A1: componente não fala com o banco.
      // Sem isto, "monólito em camadas" vira monólito com pastas bonitas.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/generated/prisma/**', '**/server/db/**'],
              message:
                'Componente não fala com o banco. Use src/server/queries ou src/server/actions.',
            },
          ],
        },
      ],
    },
  },
  {
    // Código vendorizado pelo CLI do shadcn. Não é nosso, e reescrever a cada
    // `shadcn add` seria perder a atualização do upstream.
    files: ['src/components/ui/**', 'src/hooks/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    // A camada de servidor é justamente quem pode importar o banco.
    files: ['src/server/**', 'prisma/**', 'tests/**', '*.ts', '*.mjs'],
    rules: { 'no-restricted-imports': 'off' },
  },
]

export default config
