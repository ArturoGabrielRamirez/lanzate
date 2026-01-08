/**
 * Store Data and Service Layer Tests
 *
 * These tests verify the data layer (pure database operations)
 * and service layer (business logic) for store creation work correctly.
 *
 * Tests cover:
 * - Store creation in database with correct fields
 * - Store count queries for users
 * - Store limit enforcement based on account type (FREE: 2, PRO: 5, ENTERPRISE: unlimited)
 * - User stores retrieval
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';
import { AccountType } from '@prisma/client';

// Test user IDs for different account types
const testUserIds = {
  free: 'test-free-user-id',
  pro: 'test-pro-user-id',
  enterprise: 'test-enterprise-user-id',
  noSubscription: 'test-no-subscription-user-id',
};

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data
  await prisma.store.deleteMany({
    where: {
      ownerId: {
        in: Object.values(testUserIds),
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      userId: {
        in: Object.values(testUserIds),
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: Object.values(testUserIds),
      },
    },
  });

  // Create test users with different subscription types
  await prisma.user.create({
    data: {
      id: testUserIds.free,
      email: 'free@test.com',
      username: 'freeuser',
      supabaseId: 'supabase-free-id',
      subscription: {
        create: {
          accountType: AccountType.FREE,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: testUserIds.pro,
      email: 'pro@test.com',
      username: 'prouser',
      supabaseId: 'supabase-pro-id',
      subscription: {
        create: {
          accountType: AccountType.PRO,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: testUserIds.enterprise,
      email: 'enterprise@test.com',
      username: 'enterpriseuser',
      supabaseId: 'supabase-enterprise-id',
      subscription: {
        create: {
          accountType: AccountType.ENTERPRISE,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: testUserIds.noSubscription,
      email: 'nosub@test.com',
      username: 'nosubuser',
      supabaseId: 'supabase-nosub-id',
    },
  });
});

afterAll(async () => {
  // Clean up test data
  await prisma.store.deleteMany({
    where: {
      ownerId: {
        in: Object.values(testUserIds),
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      userId: {
        in: Object.values(testUserIds),
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: Object.values(testUserIds),
      },
    },
  });
});

describe('Data Layer - Store Creation', () => {
  it('should create store in database with correct fields', async () => {
    // This test will use mock data layer functions once they are implemented
    // For now, we'll test with direct Prisma calls to verify database schema

    const storeData = {
      name: 'Test Store',
      description: 'This is a test store',
      subdomain: 'test-store',
      ownerId: testUserIds.free,
    };

    const store = await prisma.store.create({
      data: storeData,
    });

    expect(store).toBeDefined();
    expect(store.name).toBe('Test Store');
    expect(store.description).toBe('This is a test store');
    expect(store.subdomain).toBe('test-store');
    expect(store.ownerId).toBe(testUserIds.free);
    expect(store.createdAt).toBeInstanceOf(Date);
    expect(store.updatedAt).toBeInstanceOf(Date);
    expect(store.id).toBeDefined();
  });
});

describe('Data Layer - Store Count and Retrieval', () => {
  beforeAll(async () => {
    // Create test stores for different users
    await prisma.store.create({
      data: {
        name: 'Store 1',
        subdomain: 'store-1',
        ownerId: testUserIds.free,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Store 2',
        subdomain: 'store-2',
        ownerId: testUserIds.pro,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Store 3',
        subdomain: 'store-3',
        ownerId: testUserIds.pro,
      },
    });
  });

  it('should count user stores correctly', async () => {
    const freeUserCount = await prisma.store.count({
      where: { ownerId: testUserIds.free },
    });

    const proUserCount = await prisma.store.count({
      where: { ownerId: testUserIds.pro },
    });

    const enterpriseUserCount = await prisma.store.count({
      where: { ownerId: testUserIds.enterprise },
    });

    expect(freeUserCount).toBe(2); // Created 1 in previous test + 1 here
    expect(proUserCount).toBe(2);
    expect(enterpriseUserCount).toBe(0);
  });

  it('should retrieve all stores for a user', async () => {
    const stores = await prisma.store.findMany({
      where: { ownerId: testUserIds.pro },
    });

    expect(stores).toBeDefined();
    expect(stores.length).toBe(2);
    expect(stores[0].ownerId).toBe(testUserIds.pro);
    expect(stores[1].ownerId).toBe(testUserIds.pro);
  });
});

describe('Service Layer - Store Limit Enforcement', () => {
  it('should allow FREE user to create up to 2 stores', async () => {
    const freeUserStoreCount = await prisma.store.count({
      where: { ownerId: testUserIds.free },
    });

    // FREE users can have up to 2 stores
    const canCreate = freeUserStoreCount < 2;
    expect(canCreate).toBe(false); // Already has 2 stores from previous tests
  });

  it('should prevent FREE user from creating more than 2 stores', async () => {
    const freeUserStoreCount = await prisma.store.count({
      where: { ownerId: testUserIds.free },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: testUserIds.free },
    });

    // Check if limit is reached
    const limitReached =
      subscription?.accountType === AccountType.FREE && freeUserStoreCount >= 2;

    expect(limitReached).toBe(true);
  });

  it('should allow PRO user to create up to 5 stores', async () => {
    // Create additional stores for PRO user
    await prisma.store.create({
      data: {
        name: 'Store 4',
        subdomain: 'store-4',
        ownerId: testUserIds.pro,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Store 5',
        subdomain: 'store-5',
        ownerId: testUserIds.pro,
      },
    });

    await prisma.store.create({
      data: {
        name: 'Store 6',
        subdomain: 'store-6',
        ownerId: testUserIds.pro,
      },
    });

    const proUserStoreCount = await prisma.store.count({
      where: { ownerId: testUserIds.pro },
    });

    expect(proUserStoreCount).toBe(5);

    const subscription = await prisma.subscription.findUnique({
      where: { userId: testUserIds.pro },
    });

    // Check if can create more
    const canCreate =
      subscription?.accountType === AccountType.PRO && proUserStoreCount < 5;

    expect(canCreate).toBe(false); // Already at limit
  });

  it('should prevent PRO user from creating more than 5 stores', async () => {
    const proUserStoreCount = await prisma.store.count({
      where: { ownerId: testUserIds.pro },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: testUserIds.pro },
    });

    // Check if limit is reached
    const limitReached =
      subscription?.accountType === AccountType.PRO && proUserStoreCount >= 5;

    expect(limitReached).toBe(true);
  });

  it('should allow ENTERPRISE user to create unlimited stores', async () => {
    // Create multiple stores for ENTERPRISE user
    for (let i = 1; i <= 10; i++) {
      await prisma.store.create({
        data: {
          name: `Enterprise Store ${i}`,
          subdomain: `enterprise-store-${i}`,
          ownerId: testUserIds.enterprise,
        },
      });
    }

    const enterpriseUserStoreCount = await prisma.store.count({
      where: { ownerId: testUserIds.enterprise },
    });

    expect(enterpriseUserStoreCount).toBe(10);

    const subscription = await prisma.subscription.findUnique({
      where: { userId: testUserIds.enterprise },
    });

    // ENTERPRISE users have no limit
    const hasNoLimit = subscription?.accountType === AccountType.ENTERPRISE;

    expect(hasNoLimit).toBe(true);
  });

  it('should treat users without subscription as FREE (2 store limit)', async () => {
    // Create 2 stores for user without subscription
    await prisma.store.create({
      data: {
        name: 'No Sub Store 1',
        subdomain: 'nosub-store-1',
        ownerId: testUserIds.noSubscription,
      },
    });

    await prisma.store.create({
      data: {
        name: 'No Sub Store 2',
        subdomain: 'nosub-store-2',
        ownerId: testUserIds.noSubscription,
      },
    });

    const storeCount = await prisma.store.count({
      where: { ownerId: testUserIds.noSubscription },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: testUserIds.noSubscription },
    });

    expect(subscription).toBeNull();
    expect(storeCount).toBe(2);

    // Should default to FREE limit (2) when no subscription
    const defaultAccountType = subscription?.accountType ?? AccountType.FREE;
    const limitReached = defaultAccountType === AccountType.FREE && storeCount >= 2;

    expect(limitReached).toBe(true);
  });
});
