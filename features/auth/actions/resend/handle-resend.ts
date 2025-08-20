import { NextRequest, NextResponse } from 'next/server';
import type { ResendEmailParams, ApiErrorResponse, ApiSuccessResponse } from '@/features/auth/types';
import { validateResendParams } from './validation';
import { handleResendError } from './error-handling';
import { EmailService } from '@/features/auth/services/email-services';
import { logResendRequest, logResendSuccess } from './logging';

/**
 * Maneja las solicitudes de reenvío de email
 */
export async function handleResend(request: NextRequest): Promise<NextResponse> {
  try {
    // Parsear el body de la request
    const body = await parseRequestBody(request);
    
    // Validar parámetros
    const validationError = validateResendParams(body);
    if (validationError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: validationError },
        { status: 400 }
      );
    }

    // Log de la solicitud
    logResendRequest(body);

    // Procesar el reenvío
    const result = await EmailService.resendConfirmation(body);

    // Log de éxito
    logResendSuccess(body.type);

    // Respuesta exitosa
    return NextResponse.json<ApiSuccessResponse>(
      {
        error: false,
        message: result.message,
        data: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    return handleResendError(error);
  }
}

/**
 * Proporciona información sobre la API
 */
export function getApiInfo(): NextResponse {
  return NextResponse.json({
    api: 'Unified Email Resend API',
    version: '1.0.0',
    supportedTypes: ['signup', 'recovery', 'email_change'],
    description: 'Unified endpoint for all email resend operations',
    usage: {
      method: 'POST',
      body: {
        type: 'signup | recovery | email_change',
        email: 'required for signup and recovery',
        step: 'optional for email_change (old_email | new_email)'
      }
    }
  });
}

/**
 * Parsea el body de la request con manejo de errores
 */
async function parseRequestBody(request: NextRequest): Promise<ResendEmailParams> {
  try {
    return await request.json();
  } catch (parseError) {
    console.error('❌ Error parsing request body:', parseError);
    throw new Error('Invalid JSON in request body');
  }
}