/**
 * Minimal tests for Supabase client configuration
 *
 * These tests verify that:
 * 1. Server client initializes without errors
 * 2. Browser client initializes without errors
 * 3. Proxy utility exports the correct function
 * 4. Environment variables are correctly referenced
 *
 * Note: These are basic initialization tests only. Comprehensive auth flow
 * testing is deferred to the Authentication spec.
 *
 * To run: bun test __tests__/supabase-clients.test.ts
 */

import { describe, test, expect } from 'bun:test'

describe('Supabase Server Client', () => {
  test('should export createClient function', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    expect(typeof createClient).toBe('function')
  })

  test('should require environment variables', async () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Set temporary values for test
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    const { createClient } = await import('@/lib/supabase/server')
    expect(createClient).toBeDefined()

    // Restore original values
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })
})

describe('Supabase Browser Client', () => {
  test('should export createClient function', async () => {
    const { createClient } = await import('@/lib/supabase/client')
    expect(typeof createClient).toBe('function')
  })

  test('should create client with environment variables', () => {
    // Set temporary environment variables for test
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    const { createClient } = require('@/lib/supabase/client')
    const client = createClient()

    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })
})

describe('Supabase Proxy Utility', () => {
  test('should export updateSession function', async () => {
    const { updateSession } = await import('@/lib/supabase/proxy')
    expect(typeof updateSession).toBe('function')
  })

  test('updateSession should return a Promise', async () => {
    const { updateSession } = await import('@/lib/supabase/proxy')
    // Create a minimal mock request object
    const mockRequest = {
      cookies: {
        getAll: () => [],
      },
      nextUrl: {
        pathname: '/test',
      },
    } as any

    const result = updateSession(mockRequest)
    expect(result).toBeInstanceOf(Promise)
  })
})

describe('Next.js Proxy Configuration', () => {
  test('should export proxy function', async () => {
    const proxyModule = await import('@/proxy')
    expect(typeof proxyModule.proxy).toBe('function')
  })

  test('should have matcher config', async () => {
    const { config } = await import('@/proxy')
    expect(config).toBeDefined()
    expect(config.matcher).toBeDefined()
    expect(Array.isArray(config.matcher)).toBe(true)
  })

  test('matcher should exclude static files', async () => {
    const { config } = await import('@/proxy')
    const matcher = config.matcher[0]
    expect(matcher).toContain('_next/static')
    expect(matcher).toContain('_next/image')
    expect(matcher).toContain('favicon.ico')
  })
})
