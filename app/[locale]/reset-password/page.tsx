
import { ResetPassword } from '@/features/auth/components'
import { Title } from '@/features/layout/components'
import { useTranslations } from 'next-intl';
export default function ResetPage() {

  const t = useTranslations("auth");

  return (
    <div className='p-4 grow flex flex-col pt-17'>
      <Title title={t("reset-password.title")} />
      <section className='grow flex justify-center items-center w-full'>
        <ResetPassword />
      </section>
    </div>
  )

}