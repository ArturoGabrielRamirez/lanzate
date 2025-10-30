/* import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import contactImage from '@/features/global/assets/Contact-us-pana.png'
import { ContactForm } from '@/features/global/components/contact-us/contact-form'

export const metadata: Metadata = {
  title: "Help",
  description: "Contact us for help",
}

export default async function HelpPage() {

  const t = await getTranslations("dashboard.help")

  return (
    <section className="min-h-dvh relative pt-17 flex">
      <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20">
        <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {t("dialog.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("dialog.description")}
            </p>
          </div>
          <ContactForm />
        </div>
        <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-start">
          <Image
            src={contactImage}
            alt="Contact us illustration"
            width={600}
            height={600}
            className="w-full antialiased object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  )
} */