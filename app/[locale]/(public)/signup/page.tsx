import { KeyRound } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import signupImage from '@/features/auth/assets/Sign up-pana.svg'
import { JoinWaitlistAlert, SignupForm, SocialLoginButtons } from '@/features/auth/components'
import { LandingSectionIconTitle, LandingText } from '@/features/global/components'
import { BackgroundPattern } from '@/features/landing/components'
import { Link } from '@/i18n/naviation'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signup.page")
  return {
    title: t('title')
  }
}

export default async function SignupPage() {

  const t = await getTranslations("auth.signup.page")

  return (
    <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
      <div className='brightness-95 dark:brightness-60 absolute inset-0'>
        <BackgroundPattern />
      </div>
      <div className="container mx-auto p-4 z-20 relative">
        <JoinWaitlistAlert />
      </div>
      <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20 z-20 relative grow">
        <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
          <div>
            <LandingSectionIconTitle icon={<KeyRound />}>
              {t('header.title')}
            </LandingSectionIconTitle>
            <LandingText>
              {t('header.description')}
            </LandingText>
          </div>
          <SignupForm />
          <SocialLoginButtons />
          <div className='w-full'>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                {t('links.hasAccount')}{" "}
              </h3>
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                {t('links.loginLink')}
              </Link>
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                {t('links.needHelp')}{" "}
              </h3>
              <Link href="/help" className="text-sm text-blue-500 hover:underline">
                {t('links.helpLink')}
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
          <Image
            src={signupImage}
            alt={t('image.alt')}
           /*  width={5} */
            className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20"
            fill
          />
        </div>
      </div>
    </section>
  )
}