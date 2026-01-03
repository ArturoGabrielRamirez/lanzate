/**
 * Data and Service Layer Tests
 *
 * These tests verify the data layer (pure database operations)
 * and service layer (business logic) work correctly together.
 *
 * Tests cover:
 * - User creation in database
 * - Username generation from email
 * - Duplicate email handling
 * - User retrieval by ID and email
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';
import { generateUsername } from '@/features/auth/utils/generateUsername';
import {
  createUserData,
  findUserByEmailData,
  findUserByIdData,
} from '@/features/auth/data';
import { createUserService } from '@/features/auth/services';

// Test data
const testEmail = 'testuser@example.com';
const testSupabaseId = 'test-supabase-id-123';
let createdUserId: string;

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: testEmail }, { supabaseId: testSupabaseId }],
    },
  });
});

afterAll(async () => {
  // Clean up test data
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: testEmail }, { supabaseId: testSupabaseId }],
    },
  });
});

describe('Username Generation', () => {
  it('should extract username from email correctly', () => {
    const username = generateUsername('john.doe@example.com');
    expect(username).toBe('john.doe');
  });

  it('should handle email with special characters', () => {
    const username = generateUsername('user+tag@domain.com');
    expect(username).toBe('user+tag');
  });

  it('should throw error for invalid email format', () => {
    expect(() => generateUsername('@example.com')).toThrow(
      'Invalid email format'
    );
  });
});

describe('Data Layer - User Creation', () => {
  it('should create user in database with correct fields', async () => {
    const user = await createUserData({
      email: testEmail,
      username: 'testuser',
      supabaseId: testSupabaseId,
    });

    // Store ID for later tests
    createdUserId = user.id;

    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.username).toBe('testuser');
    expect(user.supabaseId).toBe(testSupabaseId);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
});

describe('Data Layer - User Retrieval', () => {
  it('should find user by email', async () => {
    const user = await findUserByEmailData(testEmail);

    expect(user).toBeDefined();
    expect(user?.email).toBe(testEmail);
    expect(user?.id).toBe(createdUserId);
  });

  it('should find user by ID', async () => {
    const user = await findUserByIdData(createdUserId);

    expect(user).toBeDefined();
    expect(user?.id).toBe(createdUserId);
    expect(user?.email).toBe(testEmail);
  });

  it('should return null for non-existent email', async () => {
    const user = await findUserByEmailData('nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('should return null for non-existent ID', async () => {
    const user = await findUserByIdData('nonexistent-id');
    expect(user).toBeNull();
  });
});

describe('Service Layer - User Creation with Business Logic', () => {
  const serviceTestEmail = 'servicetest@example.com';
  const serviceTestSupabaseId = 'service-test-supabase-id';

  afterAll(async () => {
    // Clean up service test data
    await prisma.user.deleteMany({
      where: {
        email: serviceTestEmail,
      },
    });
  });

  it('should create user with auto-generated username', async () => {
    const user = await createUserService({
      email: serviceTestEmail,
      supabaseId: serviceTestSupabaseId,
    });

    expect(user).toBeDefined();
    expect(user.email).toBe(serviceTestEmail);
    expect(user.username).toBe('servicetest'); // Auto-generated from email
    expect(user.supabaseId).toBe(serviceTestSupabaseId);
  });

  it('should throw error when creating user with duplicate email', async () => {
    // Try to create user with same email again
    await expect(
      createUserService({
        email: serviceTestEmail,
        supabaseId: 'different-supabase-id',
      })
    ).rejects.toThrow('A user with this email already exists');
  });
});
