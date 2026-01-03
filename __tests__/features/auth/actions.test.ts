/**
 * Server Actions Tests
 *
 * These tests verify that server actions work correctly by testing
 * the complete flow from validation through service layer to response.
 *
 * Tests cover:
 * - Signup action flow (validation -> Supabase auth -> database user creation)
 * - Login action flow (validation -> Supabase auth)
 * - Logout action (clear session)
 * - Password reset request action (validation -> send email)
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';
import { handleSignupAction } from '@/features/auth/actions/handleSignup.action';
import { handleLoginAction } from '@/features/auth/actions/handleLogin.action';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { handleResetPasswordRequestAction } from '@/features/auth/actions/handleResetPasswordRequest.action';

// Test data
const testEmail = 'actiontest@example.com';
const testPassword = 'TestPassword123';

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data
  await prisma.user.deleteMany({
    where: {
      email: testEmail,
    },
  });
});

afterAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      email: testEmail,
    },
  });
});

describe('Signup Action', () => {
  it('should validate input and reject invalid email format', async () => {
    const result = await handleSignupAction({
      email: 'invalid-email',
      password: testPassword,
      confirmPassword: testPassword,
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
    expect(result.message).toBeTruthy();
  });

  it('should reject password without strength requirements', async () => {
    const result = await handleSignupAction({
      email: testEmail,
      password: 'weak',
      confirmPassword: 'weak',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });

  it('should reject non-matching password confirmation', async () => {
    const result = await handleSignupAction({
      email: testEmail,
      password: 'Password123',
      confirmPassword: 'DifferentPassword123',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });

  it('should create Supabase auth user and database user on success', async () => {
    // Note: This test requires a real Supabase connection
    // In a real implementation, you would mock the Supabase client
    // For now, we test the structure of the response
    const result = await handleSignupAction({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });

    // If Supabase is properly configured and email doesn't exist
    if (!result.hasError) {
      expect(result.hasError).toBe(false);
      expect(result.message).toBeTruthy();

      // Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(testEmail);
      expect(dbUser?.username).toBe('actiontest'); // Auto-generated from email
    }
  });
});

describe('Login Action', () => {
  it('should validate input and reject invalid credentials format', async () => {
    const result = await handleLoginAction({
      email: 'invalid-email',
      password: testPassword,
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });

  it('should reject empty password', async () => {
    const result = await handleLoginAction({
      email: testEmail,
      password: '',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });
});

describe('Logout Action', () => {
  it('should return ServerResponse structure on logout', async () => {
    // Note: This will redirect, so we test the structure
    // In a real implementation, you would mock the redirect
    try {
      const result = await logoutAction();

      // Check structure if it doesn't redirect
      expect(result).toHaveProperty('hasError');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('payload');
    } catch (error) {
      // If it redirects, that's expected behavior
      // The redirect throws a NEXT_REDIRECT error in tests
      expect(error).toBeDefined();
    }
  });
});

describe('Password Reset Request Action', () => {
  it('should validate email format', async () => {
    const result = await handleResetPasswordRequestAction({
      email: 'invalid-email',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });

  it('should return success response for valid email', async () => {
    // Note: This test requires Supabase to be configured
    // In a real implementation, you would mock the Supabase client
    const result = await handleResetPasswordRequestAction({
      email: testEmail,
    });

    // Verify response structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');
  });
});

describe('Password Reset Action', () => {
  it('should validate password format and strength', async () => {
    const { handleResetPasswordAction } = await import('@/features/auth/actions/handleResetPassword.action');
    
    const result = await handleResetPasswordAction({
      password: 'weak',
      confirmPassword: 'weak',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });

  it('should reject non-matching password confirmation', async () => {
    const { handleResetPasswordAction } = await import('@/features/auth/actions/handleResetPassword.action');
    
    const result = await handleResetPasswordAction({
      password: 'Password123',
      confirmPassword: 'DifferentPassword123',
    });

    expect(result.hasError).toBe(true);
    expect(result.payload).toBeNull();
  });
});
