import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server-props'

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()
  const email = formData.get('email')?.toString()

  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXTAUTH_URL}auth/confirm?next=/update-password`,
  })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}