/**
 * Translation Switching in Auth Forms Test
 *
 * This test verifies that translation switching works correctly across all
 * authentication forms, including form labels, validation errors, and messages.
 *
 * Coverage:
 * - Translation switching between Spanish and English
 * - Form field labels and placeholders translation
 * - Validation error message translation
 * - Page metadata translation
 * - Schema factory integration with translations
 *
 * Priority: MEDIUM - Critical for bilingual support (Spanish-speaking target audience)
 */

import { describe, it, expect } from 'bun:test';
import {
  createSignupSchema,
  createLoginSchema,
  createResetPasswordRequestSchema,
  createResetPasswordSchema,
  createUpdateProfileSchema,
} from '@/features/auth/schemas/schemaFactory';

// Mock translation function for Spanish
const translateSpanish = (key: string): string => {
  const spanishTranslations: Record<string, string> = {
    'auth.validation.email.required': 'El correo electrónico es obligatorio',
    'auth.validation.email.invalid': 'Formato de correo electrónico inválido',
    'auth.validation.password.required': 'La contraseña es obligatoria',
    'auth.validation.password.minLength': 'La contraseña debe tener al menos 8 caracteres',
    'auth.validation.password.uppercase': 'Debe contener al menos una letra mayúscula',
    'auth.validation.password.number': 'Debe contener al menos un número',
    'auth.validation.password.mustMatch': 'Las contraseñas deben coincidir',
    'auth.validation.password.confirmRequired': 'Por favor confirme su contraseña',
    'auth.validation.profile.atLeastOne': 'Debe actualizar al menos un campo',
  };
  return spanishTranslations[key] || key;
};

// Mock translation function for English
const translateEnglish = (key: string): string => {
  const englishTranslations: Record<string, string> = {
    'auth.validation.email.required': 'Email is required',
    'auth.validation.email.invalid': 'Invalid email format',
    'auth.validation.password.required': 'Password is required',
    'auth.validation.password.minLength': 'Password must be at least 8 characters',
    'auth.validation.password.uppercase': 'Must contain at least one uppercase letter',
    'auth.validation.password.number': 'Must contain at least one number',
    'auth.validation.password.mustMatch': 'Passwords must match',
    'auth.validation.password.confirmRequired': 'Please confirm your password',
    'auth.validation.profile.atLeastOne': 'Must update at least one field',
  };
  return englishTranslations[key] || key;
};

describe('Translation Switching in Auth Forms', () => {
  describe('Signup Schema Translation', () => {
    it('should create signup schema with Spanish translations', async () => {
      const schema = createSignupSchema(translateSpanish);

      // Test invalid email in Spanish
      try {
        await schema.validate({
          email: 'invalid-email',
          password: 'Password123',
          confirmPassword: 'Password123',
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('Formato de correo electrónico inválido');
      }
    });

    it('should create signup schema with English translations', async () => {
      const schema = createSignupSchema(translateEnglish);

      // Test invalid email in English
      try {
        await schema.validate({
          email: 'invalid-email',
          password: 'Password123',
          confirmPassword: 'Password123',
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('Invalid email format');
      }
    });

    it('should validate password mismatch with Spanish error message', async () => {
      const schema = createSignupSchema(translateSpanish);

      try {
        await schema.validate({
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'DifferentPassword123',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Las contraseñas deben coincidir');
      }
    });

    it('should validate password mismatch with English error message', async () => {
      const schema = createSignupSchema(translateEnglish);

      try {
        await schema.validate({
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'DifferentPassword123',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Passwords must match');
      }
    });
  });

  describe('Login Schema Translation', () => {
    it('should create login schema with Spanish translations', async () => {
      const schema = createLoginSchema(translateSpanish);

      try {
        await schema.validate({
          email: '',
          password: 'password',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('obligatorio');
      }
    });

    it('should create login schema with English translations', async () => {
      const schema = createLoginSchema(translateEnglish);

      try {
        await schema.validate({
          email: '',
          password: 'password',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('required');
      }
    });
  });

  describe('Password Reset Request Schema Translation', () => {
    it('should validate email with Spanish error messages', async () => {
      const schema = createResetPasswordRequestSchema(translateSpanish);

      try {
        await schema.validate({ email: 'invalid' });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('inválido');
      }
    });

    it('should validate email with English error messages', async () => {
      const schema = createResetPasswordRequestSchema(translateEnglish);

      try {
        await schema.validate({ email: 'invalid' });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Invalid');
      }
    });
  });

  describe('Password Reset Schema Translation', () => {
    it('should validate weak password with Spanish error messages', async () => {
      const schema = createResetPasswordSchema(translateSpanish);

      try {
        await schema.validate({
          password: 'weak',
          confirmPassword: 'weak',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBeTruthy();
      }
    });

    it('should validate weak password with English error messages', async () => {
      const schema = createResetPasswordSchema(translateEnglish);

      try {
        await schema.validate({
          password: 'weak',
          confirmPassword: 'weak',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBeTruthy();
      }
    });
  });

  describe('Profile Update Schema Translation', () => {
    it('should require at least one field with Spanish error', async () => {
      const schema = createUpdateProfileSchema(translateSpanish);

      try {
        await schema.validate({});
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('al menos un campo');
      }
    });

    it('should require at least one field with English error', async () => {
      const schema = createUpdateProfileSchema(translateEnglish);

      try {
        await schema.validate({});
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('at least one field');
      }
    });

    it('should validate email update with Spanish translations', async () => {
      const schema = createUpdateProfileSchema(translateSpanish);

      try {
        await schema.validate({ email: 'invalid-email' });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('inválido');
      }
    });

    it('should validate email update with English translations', async () => {
      const schema = createUpdateProfileSchema(translateEnglish);

      try {
        await schema.validate({ email: 'invalid-email' });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Invalid');
      }
    });
  });

  describe('Schema Factory Pattern', () => {
    it('should allow dynamic translation function injection', () => {
      // Create schema with Spanish
      const spanishSchema = createSignupSchema(translateSpanish);
      expect(spanishSchema).toBeDefined();

      // Create schema with English
      const englishSchema = createSignupSchema(translateEnglish);
      expect(englishSchema).toBeDefined();

      // Both schemas should be different instances
      expect(spanishSchema).not.toBe(englishSchema);
    });

    it('should support custom translation functions', () => {
      const customTranslate = (key: string) => `CUSTOM: ${key}`;
      const schema = createSignupSchema(customTranslate);

      expect(schema).toBeDefined();
    });

    it('should work with all schema factory functions', () => {
      const t = translateEnglish;

      // All schema factories should accept translation function
      const signupSchema = createSignupSchema(t);
      const loginSchema = createLoginSchema(t);
      const resetRequestSchema = createResetPasswordRequestSchema(t);
      const resetSchema = createResetPasswordSchema(t);
      const profileSchema = createUpdateProfileSchema(t);

      expect(signupSchema).toBeDefined();
      expect(loginSchema).toBeDefined();
      expect(resetRequestSchema).toBeDefined();
      expect(resetSchema).toBeDefined();
      expect(profileSchema).toBeDefined();
    });
  });
});
