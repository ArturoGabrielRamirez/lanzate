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

export interface EmailChangeStatus {
    hasEmailChange: boolean;
    oldEmailConfirmed: boolean;
    newEmailConfirmed: boolean;
    newEmail: string | null;
    currentEmail: string;
    loading: boolean;
    processCompleted: boolean;
    requestId?: number | undefined;
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


export type { FacebookLogoProps } from "./facebook-logo";
export type { GoogleLogoProps } from "./google-logo";
export type { LoginErrorDisplayProps } from "./login-error-display";
