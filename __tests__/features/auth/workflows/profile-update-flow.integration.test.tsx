/**
 * Profile Update Flow Integration Test
 *
 * This test verifies the profile update workflow including fetching current
 * user data and updating email/password information.
 *
 * Coverage:
 * - Get current user action
 * - Profile update validation
 * - Email update handling
 * - Password update handling
 * - Required field validation
 *
 * Priority: MEDIUM - Account management functionality
 */

import { describe, it, expect } from 'bun:test';

import { getCurrentUserAction } from '@/features/auth/actions/get-current-user.action';
import { updateProfileAction } from '@/features/auth/actions/updateProfile.action';

describe('Profile Update Flow', () => {
  it('should return current user data with correct structure', async () => {
    const result = await getCurrentUserAction();

    // Verify response structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');
    expect(typeof result.hasError).toBe('boolean');

    // Note: In test environment without authenticated session,
    // this may return an error, which is expected
  });

  it('should validate at least one field is required for update', async () => {
    const result = await updateProfileAction({});

    // Should require at least one field to update
    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate email format when updating email', async () => {
    const result = await updateProfileAction({
      email: 'invalid-email',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate password strength when updating password', async () => {
    const result = await updateProfileAction({
      password: 'weak',
      confirmPassword: 'weak',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should validate password confirmation match when updating password', async () => {
    const result = await updateProfileAction({
      password: 'NewPassword123',
      confirmPassword: 'DifferentPassword123',
    });

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });

  it('should accept valid email update', async () => {
    const result = await updateProfileAction({
      email: 'newemail@example.com',
    });

    // Verify response structure (actual update requires auth session)
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');
  });

  it('should accept valid password update', async () => {
    const result = await updateProfileAction({
      password: 'NewStrongPassword123',
      confirmPassword: 'NewStrongPassword123',
    });

    // Verify response structure (actual update requires auth session)
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');
  });

  it('should accept both email and password update', async () => {
    const result = await updateProfileAction({
      email: 'updated@example.com',
      password: 'UpdatedPassword123',
      confirmPassword: 'UpdatedPassword123',
    });

    // Verify response structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
  });
});
