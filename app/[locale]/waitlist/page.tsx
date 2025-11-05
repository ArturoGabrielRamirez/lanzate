import { ListChecks } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import waitlistImage from "@/features/auth/assets/Waiting-pana.svg";
import { JoinWaitlist } from "@/features/auth/components";
import { LandingText } from "@/features/global/components";
import { BackgroundPattern } from "@/features/landing/components";
import { Link } from "@/i18n/naviation";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth.waitlist.page")
    return {
        title: t('title'),
        description: t('description'),
    }
}

export default async function WaitlistPage() {

    const t = await getTranslations("auth.waitlist.page")

    return (
        <section className="md:min-h-dvh relative pt-17 flex">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 xl:[row-gap:0] justify-center items-center md:pb-12 lg:pb-20 z-20 relative">
                <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <ListChecks />
                            <h2 className="text-2xl font-bold font-oswald">{t('header.title')}</h2>
                        </div>
                        <LandingText>
                            {t('header.description')}
                        </LandingText>
                    </div>
                    <JoinWaitlist />
                    <div className='w-full'>
                        <div className="flex gap-2 items-center justify-center w-full">
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                                {t('links.needHelp')}{" "}
                            </h3>
                            <Link href="/help" className="text-sm text-blue-500 hover:underline">
                                {t('links.helpLink')}
                            </Link>
                        </div>
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
                                {t('links.backToHomeLabel')}{" "}
                            </h3>
                            <Link href="/" className="text-sm text-blue-500 hover:underline">
                                {t('links.backToHomeLink')}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-md justify-self-start">
                    <Image
                        src={waitlistImage}
                        alt={t('image.alt')}
                        width={5}
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20"
                    />

                </div>
            </div>
        </section>
    )
}