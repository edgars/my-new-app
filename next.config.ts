import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // better-sqlite3 é um binding nativo: precisa ficar fora do bundle do servidor.
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
}

export default nextConfig
