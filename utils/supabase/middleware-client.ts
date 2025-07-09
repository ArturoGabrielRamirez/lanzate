import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest, type NextResponse } from 'next/server'

export function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse
) {
  return createMiddlewareClient({ req: request, res: response });
}
