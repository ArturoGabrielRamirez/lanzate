import { getApiInfo, handleResend } from '@/features/auth/actions/resend/handle-resend';
import { NextRequest/* , NextResponse */ } from 'next/server';


export async function POST(request: NextRequest) {
  return handleResend(request);
}

export async function GET( ) {
  return getApiInfo();
}
