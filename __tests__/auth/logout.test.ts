/**
 * Logout Action Tests
 *
 * These tests verify the logout Server Action functionality:
 * 1. Logout action exports correctly
 * 2. Action wrapper utilities are available
 * 3. Response format validation
 *
 * Note: Full integration testing with Supabase mocking is complex and deferred.
 * These tests verify the structure and exports are correct.
 *
 * To run: bun test __tests__/auth/logout.test.ts
 */

import { describe, test, expect } from 'bun:test';

describe('Logout Action', () => {
  test('should export logoutAction function', async () => {
    const { logoutAction } = await import('@/features/auth/actions/logout.action');
    expect(typeof logoutAction).toBe('function');
  });

  test('should export from auth actions index', async () => {
    const authActions = await import('@/features/auth/actions');
    expect(typeof authActions.logoutAction).toBe('function');
  });
});

describe('Action Wrapper Utilities', () => {
  test('should have actionWrapper utility available', async () => {
    const { actionWrapper } = await import('@/features/global/utils/action-wrapper');
    expect(typeof actionWrapper).toBe('function');
  });

  test('should have formatError utility available', async () => {
    const { formatError } = await import('@/features/global/utils/format-response');
    expect(typeof formatError).toBe('function');
  });

  test('should have formatSuccess utility available', async () => {
    const { formatSuccess } = await import('@/features/global/utils/format-response');
    expect(typeof formatSuccess).toBe('function');
  });
});

describe('Server Response Format', () => {
  test('formatError should return correct structure', async () => {
    const { formatError } = await import('@/features/global/utils/format-response');
    const errorResponse = formatError('Test error message');

    expect(errorResponse).toBeDefined();
    expect(errorResponse.hasError).toBe(true);
    expect(errorResponse.message).toBe('Test error message');
    expect(errorResponse.payload).toBe(null);
  });

  test('formatSuccess should return correct structure', async () => {
    const { formatSuccess } = await import('@/features/global/utils/format-response');
    const successResponse = formatSuccess('Test success', { data: 'test' });

    expect(successResponse).toBeDefined();
    expect(successResponse.hasError).toBe(false);
    expect(successResponse.message).toBe('Test success');
    expect(successResponse.payload).toEqual({ data: 'test' });
  });
});
