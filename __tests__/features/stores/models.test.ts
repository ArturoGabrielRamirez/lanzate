/**
 * Subscription and Store Model Tests
 *
 * These tests verify the Subscription and Store Prisma models work correctly.
 * Tests are written following TDD principles - models will be created in later tasks.
 *
 * Tests cover:
 * - Subscription model: userId relationship, accountType enum validation
 * - Store model: subdomain uniqueness, ownerId relationship
 * - Store-User relationship (one-to-many)
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';

// Test data
const testUserEmail = 'storeowner@example.com';
const testSupabaseId = 'test-store-owner-supabase-id';
let testUserId: string;
let testStoreId: string;

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data
  await prisma.store.deleteMany({
    where: {
      subdomain: {
        in: ['test-store-1', 'test-store-2', 'duplicate-subdomain'],
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      user: {
        email: testUserEmail,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: testUserEmail,
    },
  });

  // Create a test user for relationship testing
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'storeowner',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;
});

afterAll(async () => {
  // Clean up test data in correct order (child to parent)
  await prisma.store.deleteMany({
    where: {
      subdomain: {
        in: ['test-store-1', 'test-store-2', 'duplicate-subdomain'],
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      userId: testUserId,
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: testUserId,
    },
  });
});

describe('Subscription Model', () => {
  it('should create subscription with userId relationship and FREE account type', async () => {
    const subscription = await prisma.subscription.create({
      data: {
        userId: testUserId,
        accountType: 'FREE',
      },
    });

    expect(subscription).toBeDefined();
    expect(subscription.userId).toBe(testUserId);
    expect(subscription.accountType).toBe('FREE');
    expect(subscription.createdAt).toBeInstanceOf(Date);
    expect(subscription.updatedAt).toBeInstanceOf(Date);

    // Clean up
    await prisma.subscription.delete({
      where: { id: subscription.id },
    });
  });

  it('should validate accountType enum accepts PRO and ENTERPRISE values', async () => {
    // Test PRO account type
    const proSubscription = await prisma.subscription.create({
      data: {
        userId: testUserId,
        accountType: 'PRO',
      },
    });
    expect(proSubscription.accountType).toBe('PRO');

    // Test ENTERPRISE account type
    await prisma.subscription.update({
      where: { id: proSubscription.id },
      data: { accountType: 'ENTERPRISE' },
    });

    const updatedSubscription = await prisma.subscription.findUnique({
      where: { id: proSubscription.id },
    });
    expect(updatedSubscription?.accountType).toBe('ENTERPRISE');

    // Clean up
    await prisma.subscription.delete({
      where: { id: proSubscription.id },
    });
  });
});

describe('Store Model', () => {
  it('should create store with required fields including subdomain and description', async () => {
    const store = await prisma.store.create({
      data: {
        name: 'Test Store',
        description: 'A test store for testing purposes',
        subdomain: 'test-store-1',
        ownerId: testUserId,
      },
    });

    testStoreId = store.id;

    expect(store).toBeDefined();
    expect(store.name).toBe('Test Store');
    expect(store.description).toBe('A test store for testing purposes');
    expect(store.subdomain).toBe('test-store-1');
    expect(store.ownerId).toBe(testUserId);
    expect(store.createdAt).toBeInstanceOf(Date);
    expect(store.updatedAt).toBeInstanceOf(Date);
  });

  it('should enforce subdomain uniqueness constraint', async () => {
    // Create first store with unique subdomain
    const firstStore = await prisma.store.create({
      data: {
        name: 'First Store',
        subdomain: 'duplicate-subdomain',
        ownerId: testUserId,
      },
    });

    // Attempt to create second store with same subdomain should fail
    await expect(
      prisma.store.create({
        data: {
          name: 'Second Store',
          subdomain: 'duplicate-subdomain',
          ownerId: testUserId,
        },
      })
    ).rejects.toThrow();

    // Clean up
    await prisma.store.delete({
      where: { id: firstStore.id },
    });
  });

  it('should establish ownerId relationship with User model', async () => {
    // Fetch store with owner relationship
    const storeWithOwner = await prisma.store.findUnique({
      where: { id: testStoreId },
      include: {
        owner: true,
      },
    });

    expect(storeWithOwner).toBeDefined();
    expect(storeWithOwner?.owner).toBeDefined();
    expect(storeWithOwner?.owner.id).toBe(testUserId);
    expect(storeWithOwner?.owner.email).toBe(testUserEmail);
  });
});

describe('Store-User Relationship (One-to-Many)', () => {
  it('should allow one user to own multiple stores', async () => {
    // Create second store for the same user
    const secondStore = await prisma.store.create({
      data: {
        name: 'Second Test Store',
        description: 'Another store for the same user',
        subdomain: 'test-store-2',
        ownerId: testUserId,
      },
    });

    // Fetch user with all their stores
    const userWithStores = await prisma.user.findUnique({
      where: { id: testUserId },
      include: {
        stores: true,
      },
    });

    expect(userWithStores).toBeDefined();
    expect(userWithStores?.stores).toBeDefined();
    expect(userWithStores?.stores.length).toBeGreaterThanOrEqual(2);

    // Verify both stores belong to the user
    const storeSubdomains = userWithStores?.stores.map(s => s.subdomain);
    expect(storeSubdomains).toContain('test-store-1');
    expect(storeSubdomains).toContain('test-store-2');

    // Clean up second store
    await prisma.store.delete({
      where: { id: secondStore.id },
    });
  });

  it('should cascade delete stores when user is deleted', async () => {
    // Create a temporary user with a store
    const tempUser = await prisma.user.create({
      data: {
        email: 'tempuser@example.com',
        username: 'tempuser',
        supabaseId: 'temp-supabase-id',
      },
    });

    const tempStore = await prisma.store.create({
      data: {
        name: 'Temporary Store',
        subdomain: 'temp-store-cascade-test',
        ownerId: tempUser.id,
      },
    });

    // Delete the user (should cascade delete the store)
    await prisma.user.delete({
      where: { id: tempUser.id },
    });

    // Verify the store was deleted via cascade
    const deletedStore = await prisma.store.findUnique({
      where: { id: tempStore.id },
    });

    expect(deletedStore).toBeNull();
  });
});
