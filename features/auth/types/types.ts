export type EmailResendType = 'signup' | 'recovery' | 'email_change';
export type EmailConfirmationType = 'signup' | 'recovery' | 'email_change'; // chequear que se este usando
export type EmailResendTarget = 'old_email' | 'new_email' | 'single';

export interface ResendEmailParams {
  type: EmailResendType;
  email?: string;
  step?: 'old_email' | 'new_email';
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
    requestId?: number;
  };
}

export interface SmartResendResponse extends ResendEmailResponse {
  data?: ResendEmailResponse['data'] & {
    requestId?: number;
  };
}  // chequear que se este usando

export interface EmailChangeStatus {
  hasEmailChange: boolean;
  oldEmailConfirmed: boolean;
  newEmailConfirmed: boolean;
  newEmail?: string | null;
  currentEmail: string;
  loading: boolean;
  processCompleted: boolean;
  requestId?: number;
  expiresAt?: Date;
  oldEmailConfirmedAt?: Date | null;
  newEmailConfirmedAt?: Date | null;
  /*  nextEmailConfirmedAt?: Date | null;
   nextStepEmail?: { email: string; type: 'old_email' | 'new_email' } | null; */
}

export interface EmailChangeStatusResponse extends EmailChangeStatus { }

export interface EmailChangeMonitorStatus extends EmailChangeStatus { } // chequear que se este usando

export interface CheckEmailProps {
  email?: string;
  type?: 'signup' | 'recovery' | 'smart';
  onComplete?: () => void;
} // chequear que se este usando

export interface CheckEmailPageProps {
  searchParams: Promise<{
    email?: string;
    type?: 'signup' | 'recovery' | 'smart';
  }>;
}

export interface EmailChangeMonitorProps {
  onComplete: () => void;
  initialOldEmail: string;
  newEmail: string;
}

export interface EmailChangeDialogProps {
  showMonitor: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  newEmail: string;
  onComplete: () => void;
}

export interface EmailChangeActionsProps {
  stepStatus: StepStatus;
  isManuallyChecking: boolean;
  handleManualCheck: () => void;
  status: EmailChangeStatus;
  isResending: boolean;
  resendCooldown: number;
  handleResendEmails: () => void;
  onComplete: () => void;
}

export interface EmailChangeFormProps {
  currentEmail: string;
  hasPendingChange: boolean;
  isProcessCompleted: boolean;
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
    currentStep: string;
  };
  initialOldEmail: string;
  newEmail: string;
}

export interface EmailStepProgressProps {
  status: {
    oldEmailConfirmed: boolean;
    hasEmailChange: boolean;
  };
  initialOldEmail: string;
  newEmail: string;
}

export interface ChangePasswordButtonProps {
  buttonText: string | React.ReactNode;
  title: string;
  className?: string;
}

export interface ChangeEmailButtonProps {
  buttonText: string | React.ReactNode;
  title: string;
  className?: string;
  currentEmail: string;
}

export interface ProgressButtonProps {
  hasPendingChange: boolean;
  isProcessCompleted: boolean;
  progressText: string;
  onShowMonitor: () => void;
}

export interface StepStatus {
  step1: string;
  step2: string;
  currentStep: string;
} // chequear que se este usando

export interface ResendCooldownState {
  isResending: boolean;
  resendCooldown: number;
  lastResendTime: number | null;
  canResend: boolean;
} // chequear que se este usando

export interface PendingChangeData {
  oldEmailConfirmed: boolean;
  newEmailConfirmed: boolean;
  newEmail: string;
  processCompleted: boolean;
}

export interface ApiResponse<T = Record<string, unknown>> {
  error: boolean;
  message: string;
  data?: T;
} // chequear que se este usando

export interface ApiErrorResponse extends ApiResponse {
  error: true;
} // chequear que se este usando

export interface ApiSuccessResponse<T = Record<string, unknown>> extends ApiResponse<T> {
  error: false;
}

export type UpdateData = {
  old_email_confirmed?: boolean;
  old_email_confirmed_at?: Date;
  new_email_confirmed?: boolean;
  new_email_confirmed_at?: Date;
  completed?: boolean;
  completed_at?: Date;
}

export interface EmailConfig {
  baseUrl: string;
  redirectPaths: {
    signup: string;
    recovery: string;
    emailChange: string;
  };
} // chequear que se este usando

export interface EmailServiceError extends Error {
  status?: number;
  code?: string;
}

export interface EmailResendLog {
  timestamp: Date;
  type: EmailResendType;
  email: string;
  success: boolean;
  error?: string;
} // chequear que se este usando

export interface EmailValidation {
  isValid: boolean;
  error?: string;
} // chequear que se este usando

export interface ResendValidation {
  canResend: boolean;
  remainingCooldown: number;
  reason?: string;
} // chequear que se este usando

export interface CapturedFile {
  file: File
  preview: string
}

export interface UseCameraOptions {
  uploadPath: 'avatar' | 'banner' | (string & {})
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
  productId?: number
  storeId?: number
}


export type { FacebookLogoProps } from "./facebook-logo";
export type { GoogleLogoProps } from "./google-logo";
export type { LoginErrorDisplayProps } from "./login-error-display";