import type { ResendEmailParams } from '@/features/auth/types';


import { isValidEmail, VALID_STEPS, VALID_TYPES } from '../../utils/resend-utils';

/**
 * Valida los parámetros de la solicitud de reenvío
 */
export function validateResendParams(params: ResendEmailParams): string | null {
  // Verificar que type esté presente
  if (!params.type) {
    return 'El campo "type" es requerido';
  }

  // Verificar que type sea válido
  if (!VALID_TYPES.includes(params.type as any)) {
    return `Tipo inválido. Debe ser uno de: ${VALID_TYPES.join(', ')}`;
  }

  // Validar email para tipos que lo requieren
  const emailValidationError = validateEmailRequirement(params);
  if (emailValidationError) {
    return emailValidationError;
  }

  // Validar step para email_change
  const stepValidationError = validateStep(params);
  if (stepValidationError) {
    return stepValidationError;
  }

  return null;
}

/**
 * Valida el requerimiento de email según el tipo
 */
function validateEmailRequirement(params: ResendEmailParams): string | null {
  // Para signup y recovery, email es requerido
  if (['signup', 'recovery'].includes(params.type) && !params.email) {
    return `El campo "email" es requerido para el tipo "${params.type}"`;
  }

  // Validar formato de email si se proporciona
  if (params.email && !isValidEmail(params.email)) {
    return 'El formato del email es inválido';
  }

  return null;
}

/**
 * Valida el step para email_change
 */
function validateStep(params: ResendEmailParams): string | null {
  if (params.type === 'email_change' && params.step) {
    if (!VALID_STEPS.includes(params.step as any)) {
      return `Step inválido. Debe ser uno de: ${VALID_STEPS.join(', ')}`;
    }
  }
  return null;
}