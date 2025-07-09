'use server'

import { createServerSideClient } from '@/utils/supabase/server'

export async function handleLogIn(formData: FormData) {
  const supabase = await createServerSideClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    throw new Error('Invalid credentials')
  }

  return { success: true }
}
