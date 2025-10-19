import { VALID_STEPS, VALID_TYPES } from '@/features/auth/actions/resend/constants';
import type { ResendEmailParams } from '@/features/auth/types';
import { EmailChangeStatus } from '@/features/auth/types/types';

export * from "@/features/auth/types/types";



export interface ResendRequestContext {
  params: ResendEmailParams;
  timestamp: Date;
  ip?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type ResendType = typeof VALID_TYPES[number];
export type ResendStep = typeof VALID_STEPS[number];

export interface UseResendEmailProps {
  email?: string;
  type: 'signup' | 'recovery' | 'smart';
  emailChangeStatus: { status: EmailChangeStatus };
}

export interface LastResendInfo {
  email: string;
  type: string;
  reason: string;
}

export interface EmailTargetInfo {
  targetEmail: string;
  message: string;
  step: string | null;
}

export interface EmailConfirmationCardProps {
  type: 'signup' | 'recovery' | 'smart';
  emailTargetInfo: EmailTargetInfo;
  lastResendInfo: LastResendInfo | null;
  isResending: boolean;
  cooldownTime: number;
  onResendEmail: () => Promise<void>;
}

export interface EmailInfoProps {
  targetEmail: string;
  lastResendInfo: LastResendInfo | null;
}

export * from '@/features/auth/types/user.types';
export * from '@/features/auth/types/login.types';
export * from '@/features/auth/types/signup.types';
export * from '@/features/auth/types/change-email.types';