// /features/auth/types/index.ts

// =========================================
// EXPORTS PRINCIPALES DE AUTH TYPES
// =========================================

// Tipos base para servicios de email
export type {
  EmailResendType,
  EmailConfirmationType,
  EmailResendTarget,
  ResendEmailParams,
  ResendEmailResponse,
  SmartResendResponse
} from './types';

// Tipos para estado de cambio de email
export type {
  EmailChangeStatus,
  EmailChangeStatusResponse,
  EmailChangeMonitorStatus
} from './types';

// Tipos para componentes
export type {
  CheckEmailProps,
  CheckEmailPageProps,
  EmailChangeMonitorProps,
  EmailChangeDialogProps,
  EmailChangeActionsProps,
  EmailChangeFormProps,
  EmailConfirmationDetectorProps,
  EmailStatusAlertsProps,
  EmailStepInstructionsProps,
  EmailStepProgressProps,
  ChangePasswordButtonProps,
  ChangeEmailButtonProps,
  GoogleLoginButtonProps,
  ProgressButtonProps
} from './types';

// Tipos para estado de pasos y control
export type {
  StepStatus,
  ResendCooldownState,
  PendingChangeData
} from './types';

// Tipos para API y respuestas
export type {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  HandleLoginAction,
  UpdateData
} from './types';

// Tipos para configuración y utilidades
export type {
  EmailConfig,
  EmailServiceError,
  EmailResendLog,
  EmailValidation,
  ResendValidation
} from './types';

// Re-exports de otros archivos de tipos
export type {
  FacebookLogoProps,
  GoogleLogoProps,
  LoginErrorDisplayProps
} from './types';

// =========================================
// EXPORT DEFAULT PARA CONVENIENCIA
// =========================================

// Si necesitas importar todos los tipos a la vez:
// import * as AuthTypes from '@/features/auth/types';

export * from './types';