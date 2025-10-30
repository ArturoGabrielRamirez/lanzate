import { Account, Prisma, User as PrismaUser } from "@prisma/client";
import { User } from "@supabase/supabase-js"
import { InferType } from "yup"

import { changeEmailSchema, joinWaitlistSchema } from "@/features/auth/schemas"
import { loginFormSchema } from "@/features/auth/schemas"
import { signUpSchema } from "@/features/auth/schemas"
import { VALID_STEPS, VALID_TYPES } from '@/features/auth/utils'


/* export interface LoginPageProps {
    searchParams: Promise<{
        error?: string
        message?: string
        subdomain?: string
        next?: string
    }>
}

export type LoginFormPayload = InferType<typeof loginFormSchema> */


type BaseUser = Pick<PrismaUser,
  'id' |
  'email' |
  'username' |
  'avatar' |
  'banner' |
  'created_at' |
  'first_name' |
  'last_name' |
  'supabase_user_id'
> & {
  created_at: Date | string  // Acepta ambos formatos
}


/* export type LocalUserType = PrismaUser & { Account: Account[] } */

export type LocalUserType = BaseUser &
  Partial<Omit<PrismaUser, keyof BaseUser | 'created_at' | 'updated_at'>> & {
    updated_at?: Date | string  // Acepta ambos formatos
    Account?: Account[]
  }


export type SignupFormPayload = InferType<typeof signUpSchema>

export interface LoginPageProps {
  searchParams: Promise<{
    error?: string
    message?: string
    subdomain?: string
    next?: string
  }>
}

export type LoginFormPayload = InferType<typeof loginFormSchema>

export type JoinWaitlistFormPayload = InferType<typeof joinWaitlistSchema>

export type ChangeEmailFormData = InferType<typeof changeEmailSchema>

export type LoginErrorDisplayProps = {
  error?: string
  message?: string
}

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
  /*  lastResendInfo: LastResendInfo | null; */
}

export type EmailResendType = 'signup' | 'recovery' | 'email_change';
export type EmailConfirmationType = 'signup' | 'recovery' | 'email_change'; // chequear que se este usando
export type EmailResendTarget = 'old_email' | 'new_email' | 'single';

export interface ResendEmailParams {
  type: EmailResendType;
  email?: string;
  step?: 'old_email' | 'new_email';
}

export type PrismaUserId = {
  userId: number
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
  currentEmail: string | undefined
  newEmail: string | null
  emailConfirmed: boolean
  hasEmailChange: boolean
  processCompleted: boolean
  oldEmailConfirmed: boolean
  newEmailConfirmed: boolean
  changeWasCancelled: boolean
  requestId?: string | number
  expiresAt?: Date
  oldEmailConfirmedAt?: Date | null
  newEmailConfirmedAt?: Date | null
  success?: boolean
  loading: boolean
  /*  nextEmailConfirmedAt?: Date | null;
   nextStepEmail?: { email: string; type: 'old_email' | 'new_email' } | null; */
}

/*  hasEmailChange: boolean;
  oldEmailConfirmed: boolean;
  newEmailConfirmed: boolean;
  newEmail?: string | null;
  currentEmail: string;
  loading: boolean;
  processCompleted: boolean;
  requestId?: number;
  expiresAt?: Date;
  oldEmailConfirmedAt?: Date | null;
  newEmailConfirmedAt?: Date | null; */

export type EmailChangeStatusResponse = EmailChangeStatus;

export type EmailChangeMonitorStatus = EmailChangeStatus; // chequear que se este usando

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

export interface EditEmailParams {
  email: string
  password: string
}

export interface CancelChangeEmailRequestParams {
  userId: number
  changeRequestId: string
}

export type CreateChangePasswordParams = {
  email: string
  currentPassword: string
}

export interface NewPassword {
  newPassword: string
  confirmNewPassword?: string
}

export interface CreateChangeEmailRequestParams {
  userId: number
  oldEmail: string
  newEmail: string
  expiresAt: Date
  emailConfirmed: boolean
}

export type UpdateSupabaseIdAndEmailParams = {
  userId: number
  supabaseId: string
  email: string
  withAccount?: boolean
}

export type UpdateUserEmailParams = {
  userId: number
  email: string
  withAccount?: boolean
}

export type UpdateUserEmailConfirmedParams = {
  newEmail: string
  email: string
  redirectTo: string
  changeRequestId: number
  userId: number
}

export interface CreateResetPasswordDataParams {
  baseUrl: string
  email: string
}

export type EmailData = {
  email: string
}

export type EmailUsedParams = {
  email: string
  userId: number
}

export type FacebookDataParams = {
  redirectUrl: string
}
export type GoogleDataParams = {
  redirectUrl: string
  subdomain: string | null
}

export type PasswordParams = {
  password: string
}

export type SignUpPermissionParams = {
  email: string
  password: string
}

export type GetSupabaseUser = {
  supabaseUser: User
}

export type GetUserBySupabaseIdParams = {
  supabaseUserId: Pick<PrismaUser, "supabase_user_id">["supabase_user_id"]
  select?: Prisma.UserSelect
}

export type GetUserByEmailParams = {
  supabaseUserEmail: Pick<User, "email">["email"]
  select?: Prisma.UserSelect
}

export type InsertUserParams = {
  email: string
  provider?: string
  supabaseUserId?: string
  avatar?: string
  username?: string
  name?: string
  lastname?: string
  phone?: string
}

export type UpdateCompleteSupabaseProcessParams = {
  localUser: {
    payload: {
      id: number;
      email: string;
      email_confirmed_at: Date | null
    } | null
  }
  changeRequest: {
    id: number;
    old_email: string;
    new_email: string;
    completed: boolean;
    completed_at: Date | null;
    new_email_confirmed: boolean;
    new_email_confirmed_at: Date | null;
    expires_at: Date;
  } | null
}

export type UpdateToCompleteChangeParams = {
  changeRequestId: number
  cancelChangeEmail: string
}

export interface CheckEmailProps {
  email?: string;
  type?: 'signup' | 'recovery' | 'smart';
}

export interface ResendButtonProps {
  isResending: boolean;
  cooldownTime: number;
  onResend: () => Promise<void>;
}

export type UpdatePasswordPayload = {
  password?: string | string[]
}

export interface ProfileEditorProps {
  currentUsername: string | null
  currentFirstName: string | null
  currentLastName: string | null
  currentPhone: string | null
  onProfileUpdate: (profile: {
    username: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
  }) => void
}

export type { FacebookLogoProps } from "@/features/auth/types";
export type { GoogleLogoProps } from "@/features/auth/types";