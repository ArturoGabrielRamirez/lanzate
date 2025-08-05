import { DotPattern } from '@/components/magicui/dot-pattern'
import { LoginForm, ResetPasswordLink } from '@/features/auth/components'
import { SocialLoginButtons } from '@/features/auth/components/social-login-buttons'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { LoginErrorDisplay } from '@/features/auth/components/login-error-display'

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
        <div className="flex flex-col p-4 grow pt-17 relative">
            <div className='flex flex-col items-center w-full max-w-4xl gap-4 mx-auto lg:flex-row grow'>
                <div className='w-full lg:pr-10'>
                    <LoginErrorDisplay
                        error={params.error}
                        message={params.message}
                    />

                    <LoginForm />
                    <ResetPasswordLink />
                </div>
                <div className='w-full h-1 lg:w-1 lg:h-100 bg-primary/50'></div>
                <SocialLoginButtons orLoginWith={t("description.or-login-with")} />
            </div>
            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ",
                )}
            />
        </div>
    )
}