import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/utils/supabase/server'
import UpdatePasswordForm from '@/features/auth/components/forms/update-password-form'
import Title from '@/features/layout/components/title'
import { getTranslations } from 'next-intl/server'


export default async function UpdatePasswordPage() {
    const supabase = createServerSideClient()
    const { data: { session } } = await (await supabase).auth.getSession()

    if (!session?.user) {
        redirect('/error')
    }

    const t = await getTranslations("auth");

    return (
        <div className='flex flex-col p-4 grow z-10'>
            <Title title={t("reset-password.title")} />
            <section className='flex flex-col items-center justify-center w-full grow'>
                <UpdatePasswordForm />
            </section>
        </div>
    )
}
