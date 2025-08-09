// /api/auth/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';

import type { 
  ResendEmailParams, 
  EmailServiceError,
  ApiErrorResponse,
  ApiSuccessResponse 
} from '../../../features/auth/types';
import { EmailService } from '@/features/auth/services/email-services';

/**
 * API unificada para reenvío de emails de autenticación
 * 
 * Reemplaza:
 * - /api/auth/resend-confirmation
 * - /api/auth/resend-recovery  
 * - /api/auth/resend-confirmation-smart
 * 
 * Body esperado:
 * {
 *   type: 'signup' | 'recovery' | 'email_change',
 *   email?: string, // Requerido para signup y recovery
 *   step?: 'old_email' | 'new_email' // Opcional para email_change
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body de la request
    let body: ResendEmailParams;
    
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError);
      return NextResponse.json<ApiErrorResponse>(
        { 
          error: true, 
          message: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    // Validar parámetros básicos
    const validationError = validateResendParams(body);
    if (validationError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: validationError },
        { status: 400 }
      );
    }

    // Log de la solicitud
    console.log(`🔄 Processing resend request: ${body.type}`, {
      type: body.type,
      email: body.email ? maskEmail(body.email) : 'N/A',
      step: body.step || 'N/A'
    });

    // Procesar el reenvío usando el servicio
    const result = await EmailService.resendConfirmation(body);

    // Log de éxito
    console.log(`✅ Resend successful for type: ${body.type}`);

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
 * Valida los parámetros de la solicitud de reenvío
 */
function validateResendParams(params: ResendEmailParams): string | null {
  // Verificar que type esté presente
  if (!params.type) {
    return 'El campo "type" es requerido';
  }

  // Verificar que type sea válido
  const validTypes = ['signup', 'recovery', 'email_change'];
  if (!validTypes.includes(params.type)) {
    return `Tipo inválido. Debe ser uno de: ${validTypes.join(', ')}`;
  }

  // Para signup y recovery, email es requerido
  if (['signup', 'recovery'].includes(params.type) && !params.email) {
    return `El campo "email" es requerido para el tipo "${params.type}"`;
  }

  // Para email_change, verificar step si se proporciona
  if (params.type === 'email_change' && params.step) {
    const validSteps = ['old_email', 'new_email'];
    if (!validSteps.includes(params.step)) {
      return `Step inválido. Debe ser uno de: ${validSteps.join(', ')}`;
    }
  }

  // Validar formato de email si se proporciona
  if (params.email && !isValidEmail(params.email)) {
    return 'El formato del email es inválido';
  }

  return null;
}

/**
 * Maneja los errores del servicio de email
 */
function handleResendError(error: unknown): NextResponse {
  console.error('❌ Resend error:', error);

  // Si es un EmailServiceError con status específico
  if (isEmailServiceError(error)) {
    return NextResponse.json<ApiErrorResponse>(
      { error: true, message: error.message },
      { status: error.status || 500 }
    );
  }

  // Si es un Error normal
  if (error instanceof Error) {
    // Errores conocidos de Supabase
    if (error.message.includes('rate limit') || error.message.includes('too many')) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: 'Demasiadas solicitudes. Espera 5 minutos antes de intentar nuevamente.' },
        { status: 429 }
      );
    }

    if (error.message.includes('not found') || error.message.includes('no user')) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: 'Usuario no encontrado con este email' },
        { status: 404 }
      );
    }

    if (error.message.includes('already confirmed')) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: 'El email ya está confirmado' },
        { status: 400 }
      );
    }

    // Error genérico
    return NextResponse.json<ApiErrorResponse>(
      { error: true, message: error.message },
      { status: 400 }
    );
  }

  // Error desconocido
  return NextResponse.json<ApiErrorResponse>(
    { error: true, message: 'Error interno del servidor' },
    { status: 500 }
  );
}

/**
 * Utilitarias
 */
function isEmailServiceError(error: unknown): error is EmailServiceError {
  return error instanceof Error && 'status' in error;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Método GET para información de la API (opcional, para debugging)
 */
export async function GET() {
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