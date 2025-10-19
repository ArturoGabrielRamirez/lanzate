import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import signupImage from '@/features/auth/assets/Sign up-pana.svg'
import { SignupForm, SocialLoginButtons } from '@/features/auth/components'
import { Link } from '@/i18n/naviation'

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to your account",
}

export default async function SignupPage() {

    const t = await getTranslations("auth")

    return (
        <section className="min-h-dvh relative pt-17 flex">
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
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
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-start">
                    <Image
                        src={signupImage}
                        alt="Hero Image"
                        width={5}
                        className="w-full antialiased object-bottom"
                    />
                </div>
            </div>
        </section>
    )
}