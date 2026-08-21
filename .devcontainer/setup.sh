#!/usr/bin/env bash
#
# Roda uma vez, na criação do Codespace (postCreateCommand).
# Idempotente: pode ser reexecutado à mão sem estragar nada.
set -euo pipefail

cd "$(dirname "$0")/.."

# 1. .env — é gitignored, então todo ambiente novo começa sem ele. Sem
#    DATABASE_URL o runtime lança "DATABASE_URL is not set" em
#    src/server/db/client.ts.
if [ -f .env ]; then
  echo "→ .env já existe, mantendo"
else
  cp .env.example .env
  echo "→ .env criado a partir de .env.example"
fi

# 2. Dependências. `npm ci` respeita o package-lock.json; se o lock estiver
#    dessincronizado do package.json, cai para install em vez de abortar o setup.
echo "→ instalando dependências"
npm ci || npm install

# 3. O Prisma Client é gerado em src/generated/, que é gitignored — sem este
#    passo qualquer import de '@/generated/prisma/client' quebra.
echo "→ gerando Prisma Client"
npx prisma generate

# 4. Banco: cria prisma/dev.db e aplica as migrations versionadas.
echo "→ aplicando migrations"
npx prisma migrate deploy

# 5. Dados de desenvolvimento, incluindo os dois usuários iniciais
#    (admin / operador — ver README.md).
echo "→ populando o banco"
npm run db:seed

echo
echo "Pronto. Suba a aplicação com:  npm run dev"
