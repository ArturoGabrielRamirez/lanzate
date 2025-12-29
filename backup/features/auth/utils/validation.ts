import type { ResendEmailParams } from '@/features/auth/types'
import { VALID_STEPS, VALID_TYPES } from '@/features/auth/utils'
import { isValidEmail } from '@/features/auth/utils/resend-utils'


export function validateResendParams(params: ResendEmailParams): string | null {

    if (!params.type) {
        return 'El campo "type" es requerido';
    }

    if (!VALID_TYPES.includes(params.type)) {
        return `Tipo inválido. Debe ser uno de: ${VALID_TYPES.join(', ')}`;
    }

    const emailValidationError = validateEmailRequirement(params);
    if (emailValidationError) {
        return emailValidationError;
    }

    const stepValidationError = validateStep(params);
    if (stepValidationError) {
        return stepValidationError;
    }

    return null;
}

function validateEmailRequirement(params: ResendEmailParams): string | null {
    if (['signup', 'recovery'].includes(params.type) && !params.email) {
        return `El campo "correo electrónico" es requerido para el tipo "${params.type}"`;
    }

    if (params.email && !isValidEmail(params.email)) {
        return 'El formato del correo electrónico no es válido';
    }

    return null;
}

function validateStep(params: ResendEmailParams): string | null {
    if (params.type === 'email_change' && params.step) {
        if (!VALID_STEPS.includes(params.step)) {
            return `El campo "step" debe ser uno de: ${VALID_STEPS.join(', ')}`;
        }
    }
    return null;
}