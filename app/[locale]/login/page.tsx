import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import loginImage from '@/features/auth/assets/Tablet login-pana.svg'
import { LoginForm, ResetPasswordLink, LoginErrorDisplay, SocialLoginButtons } from '@/features/auth/components'
import { LoginPageProps } from '@/features/auth/types'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default async function LoginPage({ searchParams }: LoginPageProps) {

    const t = await getTranslations("auth")
    const params = await searchParams

    return (
        <section className="min-h-dvh relative pt-17 flex">
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:items-end md:pb-12 lg:pb-20">
                <div className='w-full flex flex-col gap-8'>
                    <LoginErrorDisplay
                        error={params.error}
                        message={params.message}
                    />
                    <LoginForm />
                    <ResetPasswordLink />
                    <SocialLoginButtons orLoginWith={t("description.or-login-with")} />
                </div>
                <div className="relative aspect-square w-full flex items-end max-w-xl justify-self-end">
                    <Image
                        src={loginImage}
                        alt="Hero Image"
                        width={5}
                        className="w-full antialiased object-bottom"
                    />
                </div>
            </div>
        </section>
    )
}