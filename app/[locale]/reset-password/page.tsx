
import { DotPattern } from '@/components/magicui/dot-pattern';
import { ResetPassword } from '@/features/auth/components'
/* import { Title } from '@/features/layout/components' */
import { cn } from '@/lib/utils';
/* import { useTranslations } from 'next-intl'; */
export default function ResetPage() {

  /* const t = useTranslations("auth"); */

  return (
    <div className='p-4 grow flex flex-col pt-17 relative'>
      {/* <Title title={t("reset-password.title")} /> */}
      <section className='grow flex justify-center items-center w-full'>
        <ResetPassword />
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