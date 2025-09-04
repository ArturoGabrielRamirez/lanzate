import { NextRequest, NextResponse } from 'next/server';
import type { ResendEmailParams, ApiErrorResponse, ApiSuccessResponse } from '@/features/auth/types';
import { validateResendParams } from './validation';
import { handleResendError } from './error-handling';
import { EmailService } from '@/features/auth/services/email-services';

export async function handleResend(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await parseRequestBody(request);
    
    const validationError = validateResendParams(body);
    if (validationError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: true, message: validationError },
        { status: 400 }
      );
    }

    const result = await EmailService.resendConfirmation(body);

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


async function parseRequestBody(request: NextRequest): Promise<ResendEmailParams> {
  try {
    return await request.json();
  } catch (parseError) {
    console.error('❌ Error parsing request body:', parseError);
    throw new Error('Invalid JSON in request body');
  }
}