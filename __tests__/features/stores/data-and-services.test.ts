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
import {
  createStoreData,
  findUserStoresData,
  countUserStoresData,
  findStoreBySubdomainData,
} from '@/features/stores/data';
import { createStoreService } from '@/features/stores/services';

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
    const storeData = {
      name: 'Test Store',
      description: 'This is a test store',
      subdomain: 'test-store',
    };

    const store = await createStoreData(storeData, testUserIds.free);

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
    const freeUserCount = await countUserStoresData(testUserIds.free);
    const proUserCount = await countUserStoresData(testUserIds.pro);
    const enterpriseUserCount = await countUserStoresData(testUserIds.enterprise);

    expect(freeUserCount).toBe(2); // Created 1 in previous test + 1 here
    expect(proUserCount).toBe(2);
    expect(enterpriseUserCount).toBe(0);
  });

  it('should retrieve all stores for a user', async () => {
    const stores = await findUserStoresData(testUserIds.pro);

    expect(stores).toBeDefined();
    expect(stores.length).toBe(2);
    expect(stores[0].ownerId).toBe(testUserIds.pro);
    expect(stores[1].ownerId).toBe(testUserIds.pro);
  });
});

describe('Service Layer - Store Limit Enforcement', () => {
  it('should allow FREE user to create up to 2 stores', async () => {
    const freeUserStoreCount = await countUserStoresData(testUserIds.free);

    // FREE users can have up to 2 stores
    const canCreate = freeUserStoreCount < 2;
    expect(canCreate).toBe(false); // Already has 2 stores from previous tests
  });

  it('should prevent FREE user from creating more than 2 stores', async () => {
    // Try to create a third store for FREE user (should throw error)
    await expect(
      createStoreService(
        {
          name: 'Third Store',
          subdomain: 'third-store',
        },
        testUserIds.free
      )
    ).rejects.toThrow('errors.store.limitReached.free');
  });

  it('should allow PRO user to create up to 5 stores', async () => {
    // Create additional stores for PRO user using the service
    await createStoreService(
      {
        name: 'Store 4',
        subdomain: 'store-4',
      },
      testUserIds.pro
    );

    await createStoreService(
      {
        name: 'Store 5',
        subdomain: 'store-5',
      },
      testUserIds.pro
    );

    await createStoreService(
      {
        name: 'Store 6',
        subdomain: 'store-6',
      },
      testUserIds.pro
    );

    const proUserStoreCount = await countUserStoresData(testUserIds.pro);

    expect(proUserStoreCount).toBe(5);
  });

  it('should prevent PRO user from creating more than 5 stores', async () => {
    // Try to create a sixth store for PRO user (should throw error)
    await expect(
      createStoreService(
        {
          name: 'Sixth Store',
          subdomain: 'sixth-store',
        },
        testUserIds.pro
      )
    ).rejects.toThrow('errors.store.limitReached.pro');
  });

  it('should allow ENTERPRISE user to create unlimited stores', async () => {
    // Create multiple stores for ENTERPRISE user using the service
    for (let i = 1; i <= 10; i++) {
      await createStoreService(
        {
          name: `Enterprise Store ${i}`,
          subdomain: `enterprise-store-${i}`,
        },
        testUserIds.enterprise
      );
    }

    const enterpriseUserStoreCount = await countUserStoresData(
      testUserIds.enterprise
    );

    expect(enterpriseUserStoreCount).toBe(10);
  });

  it('should treat users without subscription as FREE (2 store limit)', async () => {
    // Create 2 stores for user without subscription using the service
    await createStoreService(
      {
        name: 'No Sub Store 1',
        subdomain: 'nosub-store-1',
      },
      testUserIds.noSubscription
    );

    await createStoreService(
      {
        name: 'No Sub Store 2',
        subdomain: 'nosub-store-2',
      },
      testUserIds.noSubscription
    );

    const storeCount = await countUserStoresData(testUserIds.noSubscription);

    expect(storeCount).toBe(2);

    // Try to create a third store (should throw error with FREE limit)
    try {
      await createStoreService(
        {
          name: 'No Sub Store 3',
          subdomain: 'nosub-store-3',
        },
        testUserIds.noSubscription
      );
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toBe('errors.store.limitReached.free');
    }
  });
});

describe('Data Layer - Find Store by Subdomain', () => {
  it('should find store by subdomain when it exists', async () => {
    // Create a store with a known subdomain
    const testSubdomain = 'findable-store';
    await prisma.store.create({
      data: {
        name: 'Findable Store',
        subdomain: testSubdomain,
        ownerId: testUserIds.free,
      },
    });

    const store = await findStoreBySubdomainData(testSubdomain);

    expect(store).toBeDefined();
    expect(store?.subdomain).toBe(testSubdomain);
    expect(store?.name).toBe('Findable Store');

    // Cleanup
    await prisma.store.delete({ where: { subdomain: testSubdomain } });
  });

  it('should return null when subdomain does not exist', async () => {
    const store = await findStoreBySubdomainData('nonexistent-subdomain-xyz');

    expect(store).toBeNull();
  });

  it('should find store with case-sensitive subdomain match', async () => {
    const testSubdomain = 'case-sensitive-store';
    await prisma.store.create({
      data: {
        name: 'Case Sensitive Store',
        subdomain: testSubdomain,
        ownerId: testUserIds.free,
      },
    });

    // Exact match should work
    const exactMatch = await findStoreBySubdomainData(testSubdomain);
    expect(exactMatch).toBeDefined();
    expect(exactMatch?.subdomain).toBe(testSubdomain);

    // Different case should not match (subdomains are stored lowercase)
    const upperCase = await findStoreBySubdomainData('CASE-SENSITIVE-STORE');
    expect(upperCase).toBeNull();

    // Cleanup
    await prisma.store.delete({ where: { subdomain: testSubdomain } });
  });
});
