import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import loginImage from '@/features/auth/assets/Tablet login-pana.svg'
import { LoginForm, ResetPasswordLink, LoginErrorDisplay, SocialLoginButtons } from '@/features/auth/components'
import { LoginPageProps } from '@/features/auth/types'
import { Link } from '@/i18n/naviation'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default async function LoginPage({ searchParams }: LoginPageProps) {

    const t = await getTranslations("auth")
    const params = await searchParams

    return (
        <section className="min-h-dvh relative pt-17 flex">
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
                    <LoginErrorDisplay
                        error={params.error}
                        message={params.message}
                    />
                    <LoginForm />
                    <SocialLoginButtons />
                    <div className='w-full'>
                        <ResetPasswordLink />
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                No tienes una cuenta?{" "}
                            </h3>
                            <Link href="/signup" className="text-sm text-blue-500 hover:underline">
                                {t("signup")}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-start">
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