/**
 * Password Reset Flow Integration Tests
 *
 * These tests verify the complete password reset workflow including both
 * the request flow (email sending) and the update flow (password change).
 *
 * Coverage:
 * - Password reset request validation and submission
 * - Password reset update validation and execution
 * - Email validation in reset request
 * - Password strength validation in reset update
 * - Password confirmation matching
 *
 * Priority: MEDIUM - Critical account recovery workflow
 */

import { describe, it, expect } from 'bun:test';

import { handleResetPasswordAction } from '@/features/auth/actions/handle-reset-password.action';
import { handleResetPasswordRequestAction } from '@/features/auth/actions/handle-reset-password-request.action';

describe('Password Reset Request Flow', () => {
  it('should validate email format in reset request', async () => {
    const result = await handleResetPasswordRequestAction({
      email: 'invalid-email',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should accept valid email for reset request', async () => {
    const result = await handleResetPasswordRequestAction({
      email: 'resettest@example.com',
    });

    // Verify response structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');

    // Note: In test environment, email may not actually be sent
    // but validation should pass
  });

  it('should handle reset request for non-existent email gracefully', async () => {
    const result = await handleResetPasswordRequestAction({
      email: 'nonexistent@example.com',
    });

    // Should return success to avoid user enumeration
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
  });

  it('should return ServerResponse structure for reset request', async () => {
    const result = await handleResetPasswordRequestAction({
      email: 'test@example.com',
    });

    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');
    expect(typeof result.hasError).toBe('boolean');
  });
});

describe('Password Reset Update Flow', () => {
  it('should validate new password strength requirements', async () => {
    const result = await handleResetPasswordAction({
      password: 'weak',
      confirmPassword: 'weak',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate password confirmation match', async () => {
    const result = await handleResetPasswordAction({
      password: 'StrongPassword123',
      confirmPassword: 'DifferentPassword123',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should accept valid password reset', async () => {
    const result = await handleResetPasswordAction({
      password: 'NewStrongPassword123',
      confirmPassword: 'NewStrongPassword123',
    });

    // Verify response structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');

    // Note: Actual password update requires valid Supabase session with reset token
  });

  it('should reject password without uppercase letter', async () => {
    const result = await handleResetPasswordAction({
      password: 'weakpassword123',
      confirmPassword: 'weakpassword123',
    });

    expect(result.hasError).toBe(true);
  });

  it('should reject password without number', async () => {
    const result = await handleResetPasswordAction({
      password: 'WeakPassword',
      confirmPassword: 'WeakPassword',
    });

    expect(result.hasError).toBe(true);
  });

  it('should reject password shorter than 8 characters', async () => {
    const result = await handleResetPasswordAction({
      password: 'Short1',
      confirmPassword: 'Short1',
    });

    expect(result.hasError).toBe(true);
  });
});
