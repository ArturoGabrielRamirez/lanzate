import { EmailConfirmationCardProps } from "../../types";
import { ResendButton } from "../change-visual/resend-button";
import { SupportLink } from "../change-visual/suppor-link";
import { EmailIcon } from "./email-icon";
import { EmailInfo } from "./email-info";


export function EmailConfirmationCard({
    type,
    emailTargetInfo,
    lastResendInfo,
    isResending,
    cooldownTime,
    onResendEmail
}: EmailConfirmationCardProps) {
    return (
        <>
            <div className="mb-8">
                <EmailIcon />

                <h2 className="text-2xl font-bold mb-2 bg-color-red-500">
                    {type === 'recovery' ? 'Revisa tu email' : 'Confirma tu email'}
                    {emailTargetInfo.step && (
                        <span className="text-sm font-normal text-blue-300 ml-2">
                            ({emailTargetInfo.step})
                        </span>
                    )}
                </h2>

                <p className="text-gray-300">{emailTargetInfo.message}</p>
            </div>

            <EmailInfo
                targetEmail={emailTargetInfo.targetEmail}
                lastResendInfo={lastResendInfo}
            />

            <div className="space-y-4">
                <div className="pt-4 border-t border-white/20">
                    <p className="text-sm mb-4 opacity-80">
                        ¿No recibiste el email?
                    </p>

                    <ResendButton
                        isResending={isResending}
                        cooldownTime={cooldownTime}
                        onResend={onResendEmail}
                    />
                </div>
            </div>

            <SupportLink />
        </>
    );
}