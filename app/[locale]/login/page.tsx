import { DotPattern } from '@/components/magicui/dot-pattern'
import { LoginForm, ResetPasswordLink } from '@/features/auth/components'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { LoginErrorDisplay, SocialLoginButtons } from '@/features/auth/components'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

type LoginPageProps = {
    searchParams: Promise<{
        error?: string
        message?: string
        subdomain?: string
        next?: string
    }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const t = await getTranslations("auth")
    const params = await searchParams

    return (
        <section className="flex flex-col p-4 grow pt-17 relative z-10">
            <div className='flex flex-col justify-center items-center w-full max-w-xl md:max-w-full lg:max-w-4xl gap-4 mx-auto md:flex-row grow'>
                <div className='w-full flex flex-col gap-8'>
                    <LoginErrorDisplay
                        error={params.error}
                        message={params.message}
                    />

                    <LoginForm />
                    <ResetPasswordLink />
                </div>
                <div className='w-full h-1 md:w-1 md:h-100 bg-primary/50'></div>
                <SocialLoginButtons orLoginWith={t("description.or-login-with")} />
            </div>
        </section>
    )
}