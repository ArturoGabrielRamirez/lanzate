import { NextResponse } from 'next/server';
import type { EmailServiceError, ApiErrorResponse } from '@/features/auth/types';

export function handleResendError(error: unknown): NextResponse {
  console.error('❌ Resend error:', error);

  if (isEmailServiceError(error)) {
    return NextResponse.json<ApiErrorResponse>(
      { error: true, message: error.message },
      { status: error.status || 500 }
    );
  }

  if (error instanceof Error) {
    return handleKnownErrors(error);
  }

  return NextResponse.json<ApiErrorResponse>(
    { error: true, message: 'Error interno del servidor' },
    { status: 500 }
  );
}

function handleKnownErrors(error: Error): NextResponse {
  const errorMappings = [
    {
      condition: (msg: string) => msg.includes('rate limit') || msg.includes('too many'),
      response: {
        message: 'Demasiadas solicitudes. Espera 5 minutos antes de intentar nuevamente.',
        status: 429
      }
    },
    {
      condition: (msg: string) => msg.includes('not found') || msg.includes('no user'),
      response: {
        message: 'Usuario no encontrado con este email',
        status: 404
      }
    },
    {
      condition: (msg: string) => msg.includes('already confirmed'),
      response: {
        message: 'El email ya está confirmado',
        status: 400
      }
    },
    {
      condition: (msg: string) => msg.includes('Invalid JSON'),
      response: {
        message: 'Invalid JSON in request body',
        status: 400
      }
    }
  ];

  const matchedError = errorMappings.find(mapping => 
    mapping.condition(error.message)
  );

  if (matchedError) {
    return NextResponse.json<ApiErrorResponse>(
      { error: true, message: matchedError.response.message },
      { status: matchedError.response.status }
    );
  }

  return NextResponse.json<ApiErrorResponse>(
    { error: true, message: error.message },
    { status: 400 }
  );
}


function isEmailServiceError(error: unknown): error is EmailServiceError {
  return error instanceof Error && 'status' in error;
}