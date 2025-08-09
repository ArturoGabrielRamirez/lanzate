// /features/auth/types/auth.types.ts

// =========================================
// TIPOS BASE PARA SERVICIOS
// =========================================

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
    requestId?: number; // Cambio a number
  };
}

// Tipos para respuesta de resend inteligente (ELIMINADO - no se usa)
// export interface SmartResendResponse extends ResendEmailResponse {
//   data?: ResendEmailResponse['data'] & {
//     requestId?: number;
//   };
// }

export interface EmailChangeStatusResponse {
  hasEmailChange: boolean;
  oldEmailConfirmed: boolean;
  newEmailConfirmed: boolean;
  newEmail: string | null;
  currentEmail: string;
  loading: boolean;
  processCompleted: boolean;
  requestId?: number; // Cambio a number para coincidir con tu esquema
  expiresAt?: Date;
  oldEmailConfirmedAt?: Date | null;
  newEmailConfirmedAt?: Date | null;
}

// =========================================
// TIPOS EXISTENTES DEL PROYECTO
// =========================================

export type HandleLoginAction = {
    email: string
    password: string
}

export interface ChangePasswordButtonProps {
    buttonText: string;
    title: string;
    className?: string;
}

export interface ChangeEmailButtonProps {
    buttonText: string;
    title: string;
    className?: string;
    currentEmail: string;
}

export interface EmailChangeDialogProps {
    showMonitor: boolean;
    onOpenChange: (open: boolean) => void;
    currentEmail: string;
    newEmail: string;
    onComplete: () => void;
}

export interface EmailChangeActionsProps {
    stepStatus: any,
    isManuallyChecking: boolean,
    handleManualCheck: () => void,
    status: any,
    isResending: boolean,
    resendCooldown: number,
    handleResendEmails: () => void,
    onComplete: () => void
}

export interface EmailChangeFormProps {
    currentEmail: string;
    hasPendingChange: boolean;
    isProcessCompleted: boolean;
}

export interface EmailChangeMonitorProps {
    onComplete: () => void;
    initialOldEmail: string;
    newEmail: string;
}

// Estado de cambio de email (tu versión existente)
export interface EmailChangeStatus {
    hasEmailChange: boolean;
    oldEmailConfirmed: boolean;
    newEmailConfirmed: boolean;
    newEmail: string | null;
    currentEmail: string;
    loading: boolean;
    processCompleted: boolean;
    requestId?: number | undefined; // Tu versión usa number
    expiresAt?: Date;
    oldEmailConfirmedAt?: Date | null;
    newEmailConfirmedAt?: Date | null;
}

export interface EmailConfirmationDetectorProps {
    onFirstEmailConfirmed?: () => void;
    onSecondEmailConfirmed?: () => void;
}

export interface EmailStatusAlertsProps {
    currentEmail: string;
    hasPendingChange: boolean;
    isProcessCompleted: boolean;
}

export interface EmailStepInstructionsProps {
    stepStatus: {
        currentStep: string,
    }
    initialOldEmail: string,
    newEmail: string,
}

export interface EmailStepProgressProps {
    status: {
        oldEmailConfirmed: boolean;
        hasEmailChange: boolean;
    },
    initialOldEmail: string;
    newEmail: string;
}

export interface GoogleLoginButtonProps {
    orLoginWith: string
}

export interface PendingChangeData {
    oldEmailConfirmed: boolean;
    newEmailConfirmed: boolean;
    newEmail: string;
    processCompleted: boolean;
}

export interface ProgressButtonProps {
    hasPendingChange: boolean;
    isProcessCompleted: boolean;
    progressText: string;
    onShowMonitor: () => void;
}

// =========================================
// TIPOS ADICIONALES PARA SERVICIOS
// =========================================

// Tipos para componentes
export interface CheckEmailProps {
  email?: string;
  type?: 'signup' | 'recovery' | 'smart';
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

// Union types útiles
export type EmailConfirmationType = 'signup' | 'recovery' | 'email_change';
export type EmailResendTarget = 'old_email' | 'new_email' | 'single';

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

// =========================================
// RE-EXPORTS DE TIPOS EXISTENTES
// =========================================

export type { FacebookLogoProps } from "./facebook-logo";
export type { GoogleLogoProps } from "./google-logo";
export type { LoginErrorDisplayProps } from "./login-error-display";

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
/* export type EmailConfirmationType = 'signup' | 'recovery' | 'email_change';
export type EmailResendTarget = 'old_email' | 'new_email' | 'single'; */

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

export interface CheckEmailPageProps {
    searchParams: Promise<{ 
        email?: string;
        type?: 'signup' | 'recovery' | 'smart';
    }>;
}

export type UpdateData = {
    old_email_confirmed?: boolean;
    old_email_confirmed_at?: Date;
    new_email_confirmed?: boolean;
    new_email_confirmed_at?: Date;
    completed?: boolean;
    completed_at?: Date;
}
