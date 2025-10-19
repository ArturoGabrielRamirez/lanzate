import { createServerSideClient } from '@/utils/supabase/server'

export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  const supabase = createServerSideClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return !error
}