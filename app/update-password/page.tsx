import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server-props'
import UpdatePasswordForm from '@/features/auth/components/update-password-form'


export default async function UpdatePasswordPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
        redirect('/error')
    }

    return <UpdatePasswordForm />
}
