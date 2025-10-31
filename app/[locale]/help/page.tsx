import { MessageCircle } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { JoinWaitlistAlert } from '@/features/auth/components'
import contactImage from '@/features/global/assets/Contact us-pana.svg'
import { ContactForm } from '@/features/global/components/contact-us'
import { BackgroundPattern } from '@/features/landing/components'
import { Link } from '@/i18n/naviation'


export const metadata: Metadata = {
  title: "Help",
  description: "Contact us for help",
}

export default async function HelpPage() {

  const t = await getTranslations("auth")

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
            <div className="flex items-center gap-2 text-primary">
              <MessageCircle />
              <h2 className="text-2xl font-bold font-oswald">Ayuda</h2>
            </div>
            <p className="text-muted-foreground font-quattrocento">
              Contacta con nosotros para obtener ayuda
            </p>
          </div>
          <ContactForm />
          <div className='w-full'>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                Ya tienes una cuenta?{" "}
              </h3>
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                {t("login")}
              </Link>
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                Ya solucionaste tu problema?{" "}
              </h3>
              <Link href="/" className="text-sm text-blue-500 hover:underline">
                {t("back-to-home")}
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
          <Image
            src={contactImage}
            alt="Contact us illustration"
            width={600}
            height={600}
            className="w-full antialiased object-bottom drop-shadow-xl drop-shadow-primary/30"
            priority
          />
        </div>
      </div>
    </section>
  )
}