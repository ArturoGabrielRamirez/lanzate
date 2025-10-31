import { redirect } from 'next/navigation'

import UpdatePasswordForm from '@/features/auth/components/forms/update-password-form'
import { createServerSideClient } from '@/utils/supabase/server'


export default async function UpdatePasswordPage() {
    const supabase = createServerSideClient()
    const { data: { session } } = await (await supabase).auth.getSession()

    if (!session?.user) {
        redirect('/error')
    }

    return (
        <div className='flex flex-col p-4 grow z-10'>
            <section className='flex flex-col items-center justify-center w-full grow'>
                <UpdatePasswordForm />
            </section>
        </div>
    )
}
