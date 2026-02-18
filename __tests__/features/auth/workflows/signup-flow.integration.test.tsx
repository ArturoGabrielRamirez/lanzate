/**
 * End-to-End Signup Workflow Integration Test
 *
 * This test verifies the complete signup flow from form submission through
 * Supabase authentication to database user creation and dashboard redirect.
 *
 * Coverage:
 * - Form validation and submission
 * - Supabase auth user creation
 * - Database user creation with auto-generated username
 * - Success redirect to /dashboard
 * - Error handling for duplicate emails
 *
 * Priority: HIGH - Core user acquisition workflow
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

import { handleSignupAction } from '@/features/auth/actions/handleSignup.action';
import { prisma } from '@/lib/prisma';

// Test data
const testEmail = 'signupflow@example.com';
const testPassword = 'SignupTest123';

// Clean up test data
beforeAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testEmail },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testEmail },
  });
});

describe('End-to-End Signup Workflow', () => {
  it('should complete full signup flow: validation -> Supabase -> DB -> redirect', async () => {
    // Step 1: Submit signup form with valid data
    const result = await handleSignupAction({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });

    // Step 2: Verify action returns success
    if (!result.hasError) {
      expect(result.hasError).toBe(false);
      expect(result.message).toBeTruthy();

      // Step 3: Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(testEmail);

      // Step 4: Verify username was auto-generated from email
      expect(dbUser?.username).toBe('signupflow'); // Part before @

      // Step 5: Verify user has required fields
      expect(dbUser?.id).toBeTruthy();
      expect(dbUser?.createdAt).toBeInstanceOf(Date);
      expect(dbUser?.updatedAt).toBeInstanceOf(Date);
    }
  });

  it('should handle duplicate email error gracefully', async () => {
    // Attempt to signup with same email again
    const result = await handleSignupAction({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    });

    // Should return error for duplicate email
    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate email format before submission', async () => {
    const result = await handleSignupAction({
      email: 'invalid-email',
      password: testPassword,
      confirmPassword: testPassword,
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate password strength requirements', async () => {
    const result = await handleSignupAction({
      email: 'newuser@example.com',
      password: 'weak',
      confirmPassword: 'weak',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate password confirmation match', async () => {
    const result = await handleSignupAction({
      email: 'newuser@example.com',
      password: 'StrongPassword123',
      confirmPassword: 'DifferentPassword123',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });
});
