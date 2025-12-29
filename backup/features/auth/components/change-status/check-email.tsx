import { EmailConfirmationCard } from "@/features/auth/components/change-status/email-confirmation-card"
import { LoadingState } from "@/features/auth/components/change-status/loading-state"
import { useConfirmationEmailChangeStatus } from "@/features/auth/hooks/use-confirmation-email-change-status"
import { useResendEmail } from "@/features/auth/hooks/use-resend-email"
import { CheckEmailProps, EmailChangeStatus } from "@/features/auth/types"
import { getEmailTargetInfo } from "@/features/auth/utils"

const defaultStatus: EmailChangeStatus = {
    hasEmailChange: false,
    oldEmailConfirmed: false,
    newEmailConfirmed: false,
    emailConfirmed: false,
    changeWasCancelled: false,
    newEmail: null,
    currentEmail: '',
    loading: false,
    processCompleted: false,
    requestId: undefined,
    expiresAt: undefined,
    oldEmailConfirmedAt: null,
    newEmailConfirmedAt: null,
};

export default function CheckEmail({ email, type = 'smart' }: CheckEmailProps) {
    /*  const t = useTranslations("auth.check-email"); */


    const confirmationEmailChangeStatus = useConfirmationEmailChangeStatus();

    const emailChangeStatus: { status: EmailChangeStatus } =
        type === 'smart'
            ? confirmationEmailChangeStatus
            : { status: defaultStatus };

    const {
        isResending,
        cooldownTime,
        lastResendInfo,
        handleResendEmail
    } = useResendEmail({ email, type, emailChangeStatus });

    console.log(emailChangeStatus.status);
    // Mostrar loading si estamos en modo smart y está cargando
    if (type === 'smart' && emailChangeStatus.status.loading) {
        return <LoadingState />;
    }

    const emailTargetInfo = getEmailTargetInfo({
        type,
        email,
        emailChangeStatus: emailChangeStatus.status
    });

    return (
        <div className="p-8 text-center grow text-white flex flex-col items-center justify-center h-dvh relative z-10">
            <div className="max-w-md mx-auto space-y-6">
                <EmailConfirmationCard
                    type={type}
                    emailTargetInfo={emailTargetInfo}
                    lastResendInfo={lastResendInfo}
                    isResending={isResending}
                    cooldownTime={cooldownTime}
                    onResendEmail={handleResendEmail}
                />
            </div>
        </div>
    );
}