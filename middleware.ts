import { type NextRequest } from 'next/server';
import { updateSession } from '@/features/middleware/utils';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|_vercel|auth).*)'
  ],
};