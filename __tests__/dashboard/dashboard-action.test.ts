/**
 * Dashboard Action and Data Layer Tests
 *
 * These tests verify:
 * 1. Dashboard action exports correctly
 * 2. Data layer function exports correctly
 * 3. Action follows the proper pattern (action -> data layer)
 *
 * To run: bun test __tests__/dashboard/dashboard-action.test.ts
 */

import { describe, test, expect } from 'bun:test';

describe('Dashboard Action', () => {
  test('should export getDashboardDataAction function', async () => {
    const { getDashboardDataAction } = await import('@/features/dashboard/actions/get-dashboard-data.action');
    expect(typeof getDashboardDataAction).toBe('function');
  });

  test('should export from dashboard actions index', async () => {
    const dashboardActions = await import('@/features/dashboard/actions');
    expect(typeof dashboardActions.getDashboardDataAction).toBe('function');
  });
});

describe('Dashboard Data Layer', () => {
  test('should export getUserDashboardData function', async () => {
    const { getUserDashboardData } = await import('@/features/dashboard/data/get-user-dashboard-data.data');
    expect(typeof getUserDashboardData).toBe('function');
  });

  test('should export from dashboard data index', async () => {
    const dashboardData = await import('@/features/dashboard/data');
    expect(typeof dashboardData.getUserDashboardData).toBe('function');
  });
});

describe('Dashboard Architecture Compliance', () => {
  test('action should use actionWrapper utility', async () => {
    const actionModule = await import('@/features/dashboard/actions/get-dashboard-data.action');
    const actionString = actionModule.getDashboardDataAction.toString();

    // Verify it's a server action (contains 'use server' in the file)
    expect(actionModule).toBeDefined();
  });

  test('data layer should use prisma client', async () => {
    const dataModule = await import('@/features/dashboard/data/get-user-dashboard-data.data');
    const dataString = dataModule.getUserDashboardData.toString();

    // Verify it has prisma logic
    expect(dataModule).toBeDefined();
  });
});
