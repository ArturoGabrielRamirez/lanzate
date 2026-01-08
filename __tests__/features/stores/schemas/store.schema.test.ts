/**
 * Store Validation Schema Tests
 *
 * These tests verify the store creation validation schema works correctly.
 * They test subdomain format validation, auto-lowercase transformation,
 * field length constraints, and required field validation.
 */

import { describe, it, expect } from 'bun:test';
import { createStoreSchema } from '@/features/stores/schemas/schemaFactory';

// Mock translation function for testing
const mockT = (key: string): string => key;

describe('Store Validation Schema', () => {
  describe('Valid Input Validation', () => {
    it('should validate correct store creation input', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'My Store',
        description: 'This is my awesome store',
        subdomain: 'my-store-123',
      });

      expect(result.name).toBe('My Store');
      expect(result.description).toBe('This is my awesome store');
      expect(result.subdomain).toBe('my-store-123');
    });

    it('should validate store creation with optional description', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Store Name',
        subdomain: 'store-subdomain',
      });

      expect(result.name).toBe('Store Name');
      expect(result.subdomain).toBe('store-subdomain');
      expect(result.description).toBeUndefined();
    });
  });

  describe('Subdomain Format Validation', () => {
    it('should accept lowercase alphanumeric subdomain with hyphens', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: 'test-store-123',
      });

      expect(result.subdomain).toBe('test-store-123');
    });

    it('should reject subdomain with uppercase letters before transformation', async () => {
      const schema = createStoreSchema(mockT);
      // After lowercase transformation, this should pass
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: 'TestStore',
      });

      expect(result.subdomain).toBe('teststore');
    });

    it('should reject subdomain with invalid characters', async () => {
      const schema = createStoreSchema(mockT);

      await expect(
        schema.validate({
          name: 'Test Store',
          subdomain: 'test_store',
        })
      ).rejects.toThrow();

      await expect(
        schema.validate({
          name: 'Test Store',
          subdomain: 'test store',
        })
      ).rejects.toThrow();

      await expect(
        schema.validate({
          name: 'Test Store',
          subdomain: 'test.store',
        })
      ).rejects.toThrow();
    });
  });

  describe('Subdomain Transformation', () => {
    it('should transform subdomain to lowercase automatically', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: '  MYSTORE123  ',
      });

      expect(result.subdomain).toBe('mystore123');
    });

    it('should trim whitespace from subdomain', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: '  my-store  ',
      });

      expect(result.subdomain).toBe('my-store');
    });
  });

  describe('Field Length Constraints', () => {
    it('should reject name shorter than 1 character', async () => {
      const schema = createStoreSchema(mockT);

      await expect(
        schema.validate({
          name: '',
          subdomain: 'test-store',
        })
      ).rejects.toThrow();
    });

    it('should reject name longer than 100 characters', async () => {
      const schema = createStoreSchema(mockT);
      const longName = 'a'.repeat(101);

      await expect(
        schema.validate({
          name: longName,
          subdomain: 'test-store',
        })
      ).rejects.toThrow();
    });

    it('should reject description longer than 500 characters', async () => {
      const schema = createStoreSchema(mockT);
      const longDescription = 'a'.repeat(501);

      await expect(
        schema.validate({
          name: 'Test Store',
          description: longDescription,
          subdomain: 'test-store',
        })
      ).rejects.toThrow();
    });

    it('should reject subdomain shorter than 3 characters', async () => {
      const schema = createStoreSchema(mockT);

      await expect(
        schema.validate({
          name: 'Test Store',
          subdomain: 'ab',
        })
      ).rejects.toThrow();
    });

    it('should reject subdomain longer than 63 characters', async () => {
      const schema = createStoreSchema(mockT);
      const longSubdomain = 'a'.repeat(64);

      await expect(
        schema.validate({
          name: 'Test Store',
          subdomain: longSubdomain,
        })
      ).rejects.toThrow();
    });

    it('should accept subdomain with exactly 3 characters', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: 'abc',
      });

      expect(result.subdomain).toBe('abc');
    });

    it('should accept subdomain with exactly 63 characters', async () => {
      const schema = createStoreSchema(mockT);
      const validSubdomain = 'a'.repeat(63);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: validSubdomain,
      });

      expect(result.subdomain).toBe(validSubdomain);
    });
  });

  describe('Required Field Validation', () => {
    it('should reject missing name field', async () => {
      const schema = createStoreSchema(mockT);

      await expect(
        schema.validate({
          subdomain: 'test-store',
        })
      ).rejects.toThrow();
    });

    it('should reject missing subdomain field', async () => {
      const schema = createStoreSchema(mockT);

      await expect(
        schema.validate({
          name: 'Test Store',
        })
      ).rejects.toThrow();
    });

    it('should accept missing description field (optional)', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        subdomain: 'test-store',
      });

      expect(result.name).toBe('Test Store');
      expect(result.subdomain).toBe('test-store');
    });
  });

  describe('Field Trimming', () => {
    it('should trim whitespace from name field', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: '  Test Store  ',
        subdomain: 'test-store',
      });

      expect(result.name).toBe('Test Store');
    });

    it('should trim whitespace from description field', async () => {
      const schema = createStoreSchema(mockT);
      const result = await schema.validate({
        name: 'Test Store',
        description: '  This is a description  ',
        subdomain: 'test-store',
      });

      expect(result.description).toBe('This is a description');
    });
  });
});
