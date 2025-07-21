'use server'

import { formatErrorResponse } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleLogIn(formData: FormData) {
  try {

    const supabase = await createServerSideClient()
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error, data: { user } } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.log(error)
      throw new Error('Invalid credentials')
    }

    return {
      error: false,
      message: "Logged in successfully",
      payload: user
    }
  } catch (error) {
    return formatErrorResponse("Error logging in", error)
  }
}
