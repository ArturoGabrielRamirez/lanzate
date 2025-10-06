import { PrismaClient } from '@prisma/client';

/**
 * Global reference to PrismaClient to prevent multiple instances in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton instance of PrismaClient
 * In development, this prevents hot-reload from creating new instances
 * In production, creates a single instance
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

