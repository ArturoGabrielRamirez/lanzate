import { LoginForm, ResetPasswordLink } from '@/features/auth/components'
import { GoogleLoginButton } from '@/features/auth/components/login-google-button'
import { Title } from '@/features/layout/components'
import { getTranslations } from 'next-intl/server'


export default async function LoginPage() {
    const t = await getTranslations("auth")

    return (
        <div className="flex flex-col p-4 grow max-md:pt-24">
            <Title title={t("login")} />
            <div className='flex flex-col items-center w-full max-w-4xl gap-4 mx-auto lg:flex-row grow'>
                <div className='w-full lg:pr-10'>
                    <LoginForm />
                    <ResetPasswordLink />
                </div>
                <div className='w-full h-1 lg:w-1 lg:h-100 bg-primary/50'></div>
                <GoogleLoginButton orLoginWith={t("description.or-login-with")} />
            </div>
        </div>
    )
}