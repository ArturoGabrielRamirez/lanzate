import { createServerSideClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const supabase = await createServerSideClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.auth.signOut()
  }
  revalidatePath('/account', 'layout')
  return NextResponse.redirect(new URL('/account', req.url), {
    status: 302,
  })
}