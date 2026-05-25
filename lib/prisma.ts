import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
    ?? 'postgresql://localhost:5432/placeholder';

  // Parse the URL so we can decode %40-encoded characters in the password,
  // and add SSL (required by Supabase).
  let pool: pg.Pool;
  try {
    const url = new URL(connectionString);
    pool = new pg.Pool({
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 5432,
      database: url.pathname.replace(/^\//, ''),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      ssl: url.hostname === 'localhost' ? false : { rejectUnauthorized: false },
      max: 1, // serverless: one connection per function instance
      idleTimeoutMillis: 10000,
    });
  } catch {
    pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 1 });
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
