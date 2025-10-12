import type { ResendEmailParams } from '@/features/auth/types';
import { VALID_STEPS, VALID_TYPES } from '../actions/resend/constants';
import { EmailChangeStatus } from './types';

export type {
  EmailResendType,
  EmailConfirmationType,
  EmailResendTarget,
  ResendEmailParams,
  ResendEmailResponse,
  SmartResendResponse
} from './types';

export type {
  EmailChangeStatus,
  EmailChangeStatusResponse,
  EmailChangeMonitorStatus
} from './types';

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

export type {
  StepStatus,
  ResendCooldownState,
  PendingChangeData
} from './types';

export type {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  HandleLoginAction,
  UpdateData
} from './types';

export type {
  EmailConfig,
  EmailServiceError,
  EmailResendLog,
  EmailValidation,
  ResendValidation
} from './types';

export type {
  FacebookLogoProps,
  GoogleLogoProps,
  LoginErrorDisplayProps
} from './types';




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