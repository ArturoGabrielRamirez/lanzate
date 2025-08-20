import { maskEmail } from '@/features/account/utils/utils';
import type { ResendEmailParams } from '@/features/auth/types';



/**
 * Registra una solicitud de reenvío
 */
export function logResendRequest(params: ResendEmailParams): void {
  console.log(`🔄 Processing resend request: ${params.type}`, {
    type: params.type,
    email: params.email ? maskEmail(params.email) : 'N/A',
    step: params.step || 'N/A'
  });
}

/**
 * Registra el éxito de un reenvío
 */
export function logResendSuccess(type: string): void {
  console.log(`✅ Resend successful for type: ${type}`);
}