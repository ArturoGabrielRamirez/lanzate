import { KeyRound } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import updatePasswordImage from '@/features/auth/assets/Secure login-pana.svg'
import UpdatePasswordForm from '@/features/auth/components/forms/update-password-form'
import { LandingSectionIconTitle, LandingText } from '@/features/global/components'
import { BackgroundPattern } from '@/features/landing/components'
import { createServerSideClient } from '@/utils/supabase/server'

export default async function UpdatePasswordPage() {
    const supabase = createServerSideClient()
    const { data: { session } } = await (await supabase).auth.getSession()
    const t = await getTranslations("auth.updatePassword.page")

    if (!session?.user) {
        redirect('/error')
    }

    return (
        <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20 z-20 relative grow">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
                    <div>
                        <LandingSectionIconTitle icon={<KeyRound />}>
                            {t('header.title')}
                        </LandingSectionIconTitle>
                        <LandingText>
                            {t('header.description')}
                        </LandingText>
                    </div>
                    <UpdatePasswordForm />
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
                    <Image
                        src={updatePasswordImage}
                        alt={t('image.alt')}
                        width={5}
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20"
                    />
                </div>
            </div>
        </section>
    )
}
