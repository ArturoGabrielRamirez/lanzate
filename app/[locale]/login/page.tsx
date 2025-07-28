import { DotPattern } from '@/components/magicui/dot-pattern'
import { LoginForm, ResetPasswordLink } from '@/features/auth/components'
import { GoogleLoginButton } from '@/features/auth/components/login-google-button'
import { cn } from '@/lib/utils'
/* import { Title } from '@/features/layout/components' */
import { getTranslations } from 'next-intl/server'


export default async function LoginPage() {
    const t = await getTranslations("auth")

    return (
        <div className="flex flex-col p-4 grow pt-17 relative">
            {/* <Title title={t("login")} /> */}
            <div className='flex flex-col items-center w-full max-w-4xl gap-4 mx-auto lg:flex-row grow'>
                <div className='w-full lg:pr-10'>
                    <LoginForm />
                    <ResetPasswordLink />
                </div>
                <div className='w-full h-1 lg:w-1 lg:h-100 bg-primary/50'></div>
                <GoogleLoginButton orLoginWith={t("description.or-login-with")} />
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