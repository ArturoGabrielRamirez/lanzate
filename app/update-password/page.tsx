import { UpdatePasswordForm } from '@/features/auth/components'
import { createClient } from '@/utils/supabase/server-props'
import { Title } from '@/features/layout/components'
import { redirect } from 'next/navigation'

export default async function UpdatePasswordPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
        redirect('/error')
    }

    return (
        <div className='p-4 grow flex flex-col'>
            <Title title='Update Password' />
            <section className='grow flex justify-center items-center w-full flex-col'>
                <UpdatePasswordForm />
            </section>
        </div>
    )
}
