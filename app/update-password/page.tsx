import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/utils/supabase/server'
import UpdatePasswordForm from '@/features/auth/components/update-password-form'
import Title from '@/features/layout/components/title'


export default async function UpdatePasswordPage() {
    const supabase = await createServerSideClient()
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
