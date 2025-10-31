import { EmailTargetInfo, EmailTargetParams } from "@/features/auth/types"


export function getEmailTargetInfo({ type, email, emailChangeStatus }: EmailTargetParams): EmailTargetInfo {
    if (type === 'smart' && emailChangeStatus.hasEmailChange) {
        if (!emailChangeStatus.oldEmailConfirmed) {
            return {
                targetEmail: emailChangeStatus.currentEmail || '',
                message: `Confirma tu email actual (${emailChangeStatus.currentEmail}) para continuar`,
                step: '1/2'
            };
        } else if (emailChangeStatus.oldEmailConfirmed && !emailChangeStatus.newEmailConfirmed) {
            return {
                targetEmail: emailChangeStatus.newEmail || '',
                message: `Confirma tu nuevo email (${emailChangeStatus.newEmail}) para completar el cambio`,
                step: '2/2'
            };
        }
    }

    return {
        targetEmail: email || '',
        message: 'Te hemos enviado un enlace de confirmación',
        step: null
    };
}