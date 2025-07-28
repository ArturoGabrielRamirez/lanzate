import { SignupForm } from '@/features/auth/components'
import { Title } from '@/features/layout/components'
import { useTranslations } from 'next-intl';
export default function SignupPage() {

    const t = useTranslations("auth");

    return (
        <div className='p-4 grow flex flex-col pt-17'>
            <Title title={t("signup")} />
            <section className='grow flex justify-center items-center w-full'>
                <SignupForm />
            </section>
        </div>
    )
}