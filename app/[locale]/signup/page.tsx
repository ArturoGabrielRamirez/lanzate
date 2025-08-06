import { DotPattern } from '@/components/magicui/dot-pattern'
import { SignupForm, SocialLoginButtons } from '@/features/auth/components'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to your account",
}

export default async function SignupPage() {
    const t = await getTranslations("auth")

    return (
        <div className='p-4 grow flex flex-col pt-17 relative'>
            <section className='grow flex flex-col justify-center items-center w-full gap-8'>
                <SignupForm />
                <SocialLoginButtons orLoginWith={t("description.or-login-with")} />
            </section>
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