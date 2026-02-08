import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Extract the actual PostgreSQL connection string from the Prisma Postgres URL
function getPostgresUrl(prismaUrl: string): string {
  if (prismaUrl.startsWith('prisma+postgres://')) {
    // Extract the base64 encoded data from the URL
    const match = prismaUrl.match(/api_key=([^&]+)/)
    if (match) {
      try {
        const decoded = JSON.parse(Buffer.from(match[1], 'base64').toString())
        return decoded.databaseUrl || prismaUrl
      } catch {
        // If decoding fails, return the original URL
        return prismaUrl
      }
    }
  }
  return prismaUrl
}

// Create connection pool with the actual PostgreSQL URL
const databaseUrl = process.env.DATABASE_URL || ''
const postgresUrl = getPostgresUrl(databaseUrl)

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: postgresUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
