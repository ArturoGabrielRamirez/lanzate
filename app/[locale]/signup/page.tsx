import { DotPattern } from '@/components/magicui/dot-pattern'
import { SignupForm } from '@/features/auth/components'
import { cn } from '@/lib/utils'
/* import { Title } from '@/features/layout/components' */
/* import { useTranslations } from 'next-intl'; */
export default function SignupPage() {

    /* const t = useTranslations("auth"); */

    return (
        <div className='p-4 grow flex flex-col pt-17 relative'>
            {/* <Title title={t("signup")} /> */}
            <section className='grow flex justify-center items-center w-full'>
                <SignupForm />
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