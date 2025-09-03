import { EmailChangeStatus } from "../types";


interface EmailTargetParams {
    type: 'signup' | 'recovery' | 'smart';
    email?: string;
    emailChangeStatus: EmailChangeStatus;
}

export interface EmailTargetInfo {
    targetEmail: string;
    message: string;
    step: string | null;
}

export function getEmailTargetInfo({ type, email, emailChangeStatus }: EmailTargetParams): EmailTargetInfo {
    if (type === 'smart' && emailChangeStatus.hasEmailChange) {
        if (!emailChangeStatus.oldEmailConfirmed) {
            return {
                targetEmail: emailChangeStatus.currentEmail,
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