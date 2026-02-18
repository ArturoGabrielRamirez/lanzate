/**
 * Validation Schema Tests
 *
 * These tests verify the authentication validation schemas work correctly.
 * They test email format validation, password strength requirements,
 * confirm password matching, and schema composition.
 */

import { describe, it, expect } from 'bun:test';

import {
  signupSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '@/features/auth/schemas/auth.schema';

describe('Auth Validation Schemas', () => {
  describe('Email Validation', () => {
    it('should validate correct email format and transform to lowercase', async () => {
      const result = await signupSchema.validate({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      await expect(
        signupSchema.validate({
          email: 'invalid-email',
          password: 'Password123',
          confirmPassword: 'Password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('Password Strength Validation', () => {
    it('should accept password with 8+ chars, uppercase, and number', async () => {
      const result = await signupSchema.validate({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.password).toBe('Password123');
    });

    it('should reject password without uppercase letter', async () => {
      await expect(
        signupSchema.validate({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).rejects.toThrow();
    });

    it('should reject password without number', async () => {
      await expect(
        signupSchema.validate({
          email: 'test@example.com',
          password: 'Password',
          confirmPassword: 'Password',
        })
      ).rejects.toThrow();
    });

    it('should reject password shorter than 8 characters', async () => {
      await expect(
        signupSchema.validate({
          email: 'test@example.com',
          password: 'Pass12',
          confirmPassword: 'Pass12',
        })
      ).rejects.toThrow();
    });
  });

  describe('Confirm Password Matching', () => {
    it('should accept matching passwords', async () => {
      const result = await signupSchema.validate({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(result.confirmPassword).toBe('Password123');
    });

    it('should reject non-matching passwords', async () => {
      await expect(
        signupSchema.validate({
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'DifferentPassword123',
        })
      ).rejects.toThrow();
    });
  });

  describe('Schema Composition', () => {
    it('loginSchema should validate with minimal requirements', async () => {
      const result = await loginSchema.validate({
        email: 'test@example.com',
        password: 'anypassword',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('anypassword');
    });

    it('resetPasswordRequestSchema should only require email', async () => {
      const result = await resetPasswordRequestSchema.validate({
        email: '  USER@EXAMPLE.COM  ',
      });

      expect(result.email).toBe('user@example.com');
    });

    it('resetPasswordSchema should validate password and confirm', async () => {
      const result = await resetPasswordSchema.validate({
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      });

      expect(result.password).toBe('NewPassword123');
      expect(result.confirmPassword).toBe('NewPassword123');
    });

    it('signupSchema should enforce all validation rules', async () => {
      const result = await signupSchema.validate({
        email: '  NEW.USER@EXAMPLE.COM  ',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      });

      expect(result.email).toBe('new.user@example.com');
      expect(result.password).toBe('SecurePass123');
    });
  });
});
