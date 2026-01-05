/**
 * Proxy Tests
 *
 * These tests verify that the Next.js proxy (middleware) correctly handles
 * authentication-based route protection and redirects.
 *
 * Tests cover:
 * - Unauthenticated user redirect to /login for protected routes
 * - Authenticated user redirect from /login to /dashboard
 * - Authenticated user redirect from /signup to /dashboard
 * - Protected route access with valid session
 */

import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { NextRequest } from 'next/server';

// Mock session state
let mockIsAuthenticated = false;

// Mock the hasValidSession function
mock.module('@/features/auth/utils/supabaseProxy', () => ({
  hasValidSession: mock(async () => mockIsAuthenticated),
  createProxySupabaseClient: mock(() => ({})),
}));

// Mock the updateSession to pass through
mock.module('@/lib/supabase/proxy', () => ({
  updateSession: mock(async (request: NextRequest, response?: any) => {
    const { NextResponse } = await import('next/server');
    return response || NextResponse.next({ request });
  }),
}));

// Import proxy after mocks are set up
const { proxy } = await import('@/proxy');

// Helper to create a mock NextRequest
function createMockRequest(url: string) {
  return new NextRequest(new URL(url));
}

// Helper to check if response is a redirect
function isRedirect(response: Response): boolean {
  return response.status >= 300 && response.status < 400;
}

// Helper to get redirect location
function getRedirectLocation(response: Response): string | null {
  return response.headers.get('location');
}

describe('Proxy - Route Protection', () => {
  beforeEach(() => {
    // Reset mock state before each test
    mockIsAuthenticated = false;
  });

  it('should redirect unauthenticated user from /dashboard to /login', async () => {
    mockIsAuthenticated = false;

    const request = createMockRequest('http://localhost:3000/en/dashboard');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(true);
    const location = getRedirectLocation(response);
    expect(location).toContain('/login');
  });

  it('should redirect unauthenticated user from /profile to /login', async () => {
    mockIsAuthenticated = false;

    const request = createMockRequest('http://localhost:3000/en/profile');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(true);
    const location = getRedirectLocation(response);
    expect(location).toContain('/login');
  });

  it('should redirect authenticated user from /login to /dashboard', async () => {
    mockIsAuthenticated = true;

    const request = createMockRequest('http://localhost:3000/en/login');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(true);
    const location = getRedirectLocation(response);
    expect(location).toContain('/dashboard');
  });

  it('should redirect authenticated user from /signup to /dashboard', async () => {
    mockIsAuthenticated = true;

    const request = createMockRequest('http://localhost:3000/en/signup');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(true);
    const location = getRedirectLocation(response);
    expect(location).toContain('/dashboard');
  });

  it('should allow authenticated user to access /dashboard', async () => {
    mockIsAuthenticated = true;

    const request = createMockRequest('http://localhost:3000/en/dashboard');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(false);
    expect(response.status).toBe(200);
  });

  it('should allow authenticated user to access /profile', async () => {
    mockIsAuthenticated = true;

    const request = createMockRequest('http://localhost:3000/en/profile');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(false);
    expect(response.status).toBe(200);
  });

  it('should allow unauthenticated user to access public landing page', async () => {
    mockIsAuthenticated = false;

    const request = createMockRequest('http://localhost:3000/en');
    const response = await proxy(request);

    expect(isRedirect(response)).toBe(false);
    expect(response.status).toBe(200);
  });
});
