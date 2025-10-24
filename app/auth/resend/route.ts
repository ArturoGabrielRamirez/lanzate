import { NextRequest/* , NextResponse */ } from 'next/server'

import { getApiInfo, handleResend } from '@/features/auth/utils/handle-resend'


export async function POST(request: NextRequest) {
  return handleResend(request);
}

export async function GET( ) {
  return getApiInfo();
}
