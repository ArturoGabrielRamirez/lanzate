import { describe, test, expect } from 'bun:test'
import { prisma } from '@/lib/prisma'

describe('Prisma Setup', () => {
  test('should initialize Prisma client without errors', () => {
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  test('should have User model available', () => {
    expect(prisma.user).toBeDefined()
    expect(typeof prisma.user.findMany).toBe('function')
    expect(typeof prisma.user.findUnique).toBe('function')
    expect(typeof prisma.user.create).toBe('function')
  })

  test('should have Store model available', () => {
    expect(prisma.store).toBeDefined()
    expect(typeof prisma.store.findMany).toBe('function')
    expect(typeof prisma.store.findUnique).toBe('function')
    expect(typeof prisma.store.create).toBe('function')
  })

  test('should have correct User model structure', async () => {
    // This test verifies the model structure without database connection
    // It checks that the Prisma client has the expected methods
    expect(prisma.user.fields).toBeDefined()
    
    // Verify singleton pattern works
    const { prisma: prisma2 } = await import('@/lib/prisma')
    expect(prisma).toBe(prisma2) // Should be the same instance in development
  })
})
