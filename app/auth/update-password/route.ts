import { createServerSideClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createServerSideClient()
  const formData = await request.formData()
  const password = formData.get('password')?.toString()

  if (!password) return NextResponse.json({ error: 'Missing password' }, { status: 400 })

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}