export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Enmascara un email para logs
 */
/* export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
} */

// /api/auth/resend/constants.ts
export const VALID_TYPES = ['signup', 'recovery', 'email_change'] as const;
export const VALID_STEPS = ['old_email', 'new_email'] as const;

/* export const API_CONFIG = {
  VERSION: '1.0.0',
  NAME: 'Unified Email Resend API'
} as const; */

export type ResendType = typeof VALID_TYPES[number];
export type ResendStep = typeof VALID_STEPS[number];

// /api/auth/resend/types.ts (opcional, si quieres types específicos del módulo)
import type { ResendEmailParams } from '@/features/auth/types';

export interface ResendRequestContext {
  params: ResendEmailParams;
  timestamp: Date;
  ip?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}