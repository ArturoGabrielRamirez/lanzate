import { KeyRound } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import signupImage from '@/features/auth/assets/Sign up-pana.svg'
import { JoinWaitlistAlert, SignupForm, SocialLoginButtons } from '@/features/auth/components'
import { Link } from '@/i18n/naviation'

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup to your account",
}

export default async function SignupPage() {

  const t = await getTranslations("auth")

  return (
    <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
      <div className="container mx-auto p-4">
        <JoinWaitlistAlert />
      </div>
      <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20">
        <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
          <div>
            <div className="flex items-center gap-2 text-primary">
              <KeyRound />
              <h2 className="text-2xl font-bold font-oswald">Registrarse</h2>
            </div>
            <p className="text-muted-foreground font-quattrocento">
              Regístrate para crear tu cuenta
            </p>
          </div>
          <SignupForm />
          <SocialLoginButtons />
          <div className='w-full'>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                No tienes una cuenta?{" "}
              </h3>
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                {t("login")}
              </Link>
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                Necesitas ayuda?{" "}
              </h3>
              <Link href="/help" className="text-sm text-blue-500 hover:underline">
                {t("help")}
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
          <Image
            src={signupImage}
            alt="Hero Image"
            width={5}
            className="w-full antialiased object-bottom drop-shadow-xl drop-shadow-primary/30"
          />
        </div>
      </div>
    </section>
  )
}