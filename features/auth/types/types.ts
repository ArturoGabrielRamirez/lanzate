// /features/auth/types/auth.types.ts

// Tipos base para resend de emails
export type EmailResendType = 'signup' | 'recovery' | 'email_change';

export interface ResendEmailParams {
  type: EmailResendType;
  email?: string; // Requerido para signup y recovery
  step?: 'old_email' | 'new_email'; // Opcional para email_change
}

export interface ResendEmailResponse {
  success: boolean;
  message: string;
  data?: {
    type: string;
    email: string;
    resendType?: 'old_email' | 'new_email';
    reason?: string;
    redirectTo?: string;
    requestId?: string;
  };
}

// Tipos para estado de cambio de email
export interface EmailChangeStatus {
  hasEmailChange: boolean;
  oldEmailConfirmed: boolean;
  newEmailConfirmed: boolean;
  newEmail: string | null;
  currentEmail: string;
  loading: boolean;
  processCompleted: boolean;
  requestId?: string;
  expiresAt?: Date;
  oldEmailConfirmedAt?: Date | null;
  newEmailConfirmedAt?: Date | null;
}

export interface EmailChangeStatusResponse extends EmailChangeStatus {}

// Tipos para respuesta de resend inteligente
export interface SmartResendResponse extends ResendEmailResponse {
  data?: ResendEmailResponse['data'] & {
    requestId?: string;
  };
}

// Tipos para componentes
export interface CheckEmailProps {
  email?: string;
  type?: 'signup' | 'recovery' | 'smart';
  onComplete?: () => void;
}

export interface EmailChangeMonitorProps {
  onComplete?: () => void;
  initialOldEmail?: string;
  newEmail?: string;
}

export interface EmailChangeDialogProps {
  showMonitor: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail?: string;
  newEmail?: string;
  onComplete?: () => void;
}

// Tipos para estado de pasos
export interface StepStatus {
  step1: 'pending' | 'confirmed' | 'waiting';
  step2: 'pending' | 'confirmed' | 'waiting';
  currentStep: 'step1' | 'step2' | 'completed';
}

// Tipos para cooldown de resend
export interface ResendCooldownState {
  isResending: boolean;
  resendCooldown: number;
  lastResendTime: number | null;
  canResend: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse extends ApiResponse {
  error: true;
}

export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  error: false;
}

// Tipos para configuración de emails
export interface EmailConfig {
  baseUrl: string;
  redirectPaths: {
    signup: string;
    recovery: string;
    emailChange: string;
  };
}

// Tipos para manejo de errores
export interface EmailServiceError extends Error {
  status?: number;
  code?: string;
}

// Tipos para logs y debug
export interface EmailResendLog {
  timestamp: Date;
  type: EmailResendType;
  email: string;
  success: boolean;
  error?: string;
}

// Union types útiles
export type EmailConfirmationType = 'signup' | 'recovery' | 'email_change';
export type EmailResendTarget = 'old_email' | 'new_email' | 'single';

// Tipos extendidos para compatibilidad con código existente
export interface EmailChangeMonitorStatus extends EmailChangeStatus {
  // Compatibilidad con código existente
}

// Re-exports para mantener compatibilidad
export type { EmailChangeStatus as EmailChangeMonitorStatus_Old };

// Tipos para validación
export interface EmailValidation {
  isValid: boolean;
  error?: string;
}

export interface ResendValidation {
  canResend: boolean;
  remainingCooldown: number;
  reason?: string;
}