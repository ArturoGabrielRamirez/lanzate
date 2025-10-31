import { KeyRound } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import loginImage from '@/features/auth/assets/Tablet login-pana.svg'
import { LoginForm, ResetPasswordLink, LoginErrorDisplay, SocialLoginButtons, JoinWaitlistAlert } from '@/features/auth/components'
import { LoginPageProps } from '@/features/auth/types'
import { BackgroundPattern } from '@/features/landing/components'
import { Link } from '@/i18n/naviation'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default async function LoginPage({ searchParams }: LoginPageProps) {

    const t = await getTranslations("auth")
    const params = await searchParams

    return (
        <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto p-4 z-20 relative">
                <JoinWaitlistAlert />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 xl:[row-gap:0] justify-center items-center md:pb-12 lg:pb-20 z-20 relative">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
                    <LoginErrorDisplay
                        error={params.error}
                        message={params.message}
                    />
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <KeyRound />
                            <h2 className="text-2xl font-bold font-oswald">Iniciar sesión</h2>
                        </div>
                        <p className="text-muted-foreground font-quattrocento">
                            Inicia sesión para ingresar a tu cuenta
                        </p>
                    </div>
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
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                Necesitas ayuda?{" "}
                            </h3>
                            <Link href="/help" className="text-sm text-blue-500 hover:underline">
                                {t("help")}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
                    <Image
                        src={loginImage}
                        alt="Hero Image"
                        width={5}
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow-primary/30"
                    />

                </div>
            </div>
        </section>
    )
}