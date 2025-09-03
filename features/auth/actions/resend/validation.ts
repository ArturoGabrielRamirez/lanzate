import type { ResendEmailParams } from '@/features/auth/types';
import { isValidEmail } from '../../utils/resend-utils';
import { VALID_STEPS, VALID_TYPES } from './constants';

export function validateResendParams(params: ResendEmailParams): string | null {

    if (!params.type) {
        return 'El campo "type" es requerido';
    }

    if (!VALID_TYPES.includes(params.type as any)) {
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
        return `El campo "email" es requerido para el tipo "${params.type}"`;
    }

    if (params.email && !isValidEmail(params.email)) {
        return 'El formato del email es inválido';
    }

    return null;
}

function validateStep(params: ResendEmailParams): string | null {
    if (params.type === 'email_change' && params.step) {
        if (!VALID_STEPS.includes(params.step as any)) {
            return `Step inválido. Debe ser uno de: ${VALID_STEPS.join(', ')}`;
        }
    }
    return null;
}