import { ChevronRight, Heart, MessageCircleMore, Rocket, ShoppingCart, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { LandingText } from '@/features/global/components'
import { ROUTES } from "@/features/global/constants";
import barcodeImage from "@/features/landing/assets/Barcode-pana.svg"
import devicesImage from "@/features/landing/assets/Devices-pana.svg"
import domainImage from "@/features/landing/assets/Domain names-pana.svg"
import speedImage from "@/features/landing/assets/Speed test-pana.svg"
import { LandingSectionWrapper, SectionHeader, SectionSubtitle, SectionSubtitleSmall, SmallMutedText } from "@/features/landing/components"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { Link } from '@/i18n/naviation'

async function FeaturesSection() {

    const t = await getTranslations("landing.features")

    return (
        <LandingSectionWrapper
            id="how-it-works"
            containerClassName="grid items-center gap-12 lg:grid-cols-[3fr_2fr] h-fit"
            patternBrightness="dim"
            noContentWrapper
        >
            <div className="relative h-fit z-20">
                <SectionHeader
                    icon={<Rocket />}
                    labelKey="header.label"
                    namespace="landing.features"
                />
                <div className="relative z-10 grid grid-cols-6 gap-6">
                            <Card className="relative col-span-full hover:drop-shadow-xl hover:-translate-y-1 transition-all overflow-hidden sm:col-span-3 lg:col-span-2">
                                <CardContent>
                                    <div className="relative mx-auto flex aspect-square w-full">
                                        <Image
                                            src={devicesImage}
                                            alt="Multiple devices"
                                            fill
                                        />
                                    </div>
                                    <div className="relative z-10 space-y-2 text-center">
                                        <h3 className="text-lg font-medium  font-geist">{t('highlights.allInOne.title')}</h3>
                                        <SmallMutedText>{t('highlights.allInOne.description')}</SmallMutedText>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="relative col-span-full hover:drop-shadow-xl hover:-translate-y-1 transition-all flex overflow-hidden lg:col-span-2">
                                <CardContent>
                                    <div className="relative mx-auto flex aspect-square w-full">
                                        <Image
                                            src={barcodeImage}
                                            alt="Barcode"
                                            className='scale-90'
                                            fill
                                        />
                                    </div>
                                    <div className="relative z-10 space-y-2 text-center">
                                        <h3 className="text-lg font-medium  font-geist">{t('highlights.customizable.title')}</h3>
                                        <SmallMutedText>{t('highlights.customizable.description')}</SmallMutedText>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="relative col-span-full hover:drop-shadow-xl hover:-translate-y-1 transition-all overflow-hidden sm:col-span-3 lg:col-span-2">
                                <CardContent className='flex flex-col grow'>
                                    <div className="relative mx-auto flex aspect-square w-10/12">
                                        <Image
                                            src={domainImage}
                                            alt="Multiple devices"
                                            fill
                                        />
                                    </div>
                                    <div className="relative z-10 space-y-2 text-center mt-auto">
                                        <h3 className="text-lg font-medium font-geist">{t('highlights.customDomain.title')}</h3>
                                        <SmallMutedText>{t('highlights.customDomain.description')}</SmallMutedText>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="relative col-span-full hover:drop-shadow-xl hover:-translate-y-1 transition-all overflow-hidden lg:col-span-3 hidden lg:block">
                                <CardContent className="grid pt-6 sm:grid-cols-2">
                                    <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                        <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                            <Zap className="m-auto size-6" strokeWidth={1} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white font-geist">
                                                {t('highlights.speed.title')}
                                            </h2>
                                            <SmallMutedText>{t('highlights.speed.description')}</SmallMutedText>
                                        </div>
                                    </div>
                                    <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 border-l border-t p-6 py-6 sm:ml-6 h-full">
                                        <div className="absolute left-3 top-2 flex gap-1">
                                            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                            <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        </div>
                                        <Image
                                            src={speedImage}
                                            alt="Multiple devices"
                                            fill
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="relative col-span-full hover:drop-shadow-xl hover:-translate-y-1 transition-all overflow-hidden lg:col-span-3 hidden lg:block">
                                <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                    <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                        <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                            <Users className="m-auto size-6" strokeWidth={1} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-medium transition font-geist">
                                                {t('highlights.stayConnected.title')}
                                            </h2>
                                            <SmallMutedText>{t('highlights.stayConnected.description')}</SmallMutedText>
                                        </div>
                                    </div>
                                    <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                                        <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                            <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                                <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">Likes</span>
                                                <div className="ring-background dark:ring-card size-8 ring-4 bg-primary text-primary-foreground flex items-center justify-center rounded-full">
                                                    <Heart className='size-5' />
                                                </div>
                                            </div>
                                            <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                                <div className="ring-background dark:ring-card size-8 ring-4 bg-primary text-primary-foreground flex items-center justify-center rounded-full shrink-0">
                                                    <MessageCircleMore className='size-5' />
                                                </div>
                                                <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">Comments</span>
                                            </div>
                                            <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                                <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">Orders</span>
                                                <div className="ring-background dark:ring-card size-8 ring-4 bg-primary text-primary-foreground flex items-center justify-center rounded-full">
                                                    <ShoppingCart className='size-5' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                </div>
            </div>
            <div className="space-y-8 z-20">
                <div className='text-center max-md:text-balance md:text-left'>
                    <p className="mb-2 text-sm font-medium text-primary">
                        {t('about.label')}
                    </p>
                    <SectionSubtitle>
                        {t('about.title')}
                    </SectionSubtitle>
                    <LandingText>
                        {t('about.description.paragraph1')}
                    </LandingText>
                </div>

                <div className="space-y-6 font-quattrocento text-center max-md:text-balance md:text-left">
                    <LandingText>
                        {t('about.description.paragraph2')}
                    </LandingText>
                    <LandingText>
                        {t('about.description.paragraph3')}
                    </LandingText>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-8 md:grid-cols-4">
                    <div className='text-center md:text-left'>
                        <SectionSubtitleSmall>{t('about.stats.founded.value')}</SectionSubtitleSmall>
                        <LandingText>{t('about.stats.founded.label')}</LandingText>
                    </div>
                    <div className='text-center md:text-left'>
                        <SectionSubtitleSmall>{t('about.stats.users.value')}</SectionSubtitleSmall>
                        <LandingText>{t('about.stats.users.label')}</LandingText>
                    </div>
                    <div className='text-center md:text-left'>
                        <SectionSubtitleSmall>{t('about.stats.countries.value')}</SectionSubtitleSmall>
                        <LandingText>{t('about.stats.countries.label')}</LandingText>
                    </div>
                    <div className='text-center md:text-left'>
                        <SectionSubtitleSmall>{t('about.stats.sales.value')}</SectionSubtitleSmall>
                        <LandingText>{t('about.stats.sales.label')}</LandingText>
                    </div>
                </div>

                <Link
                    href={ROUTES.ABOUT}
                    className="flex items-center text-primary hover:text-primary/80 justify-center md:justify-start"
                >
                    {t('about.link')}
                    <ChevronRight className="size-4 ml-2" />
                </Link>
            </div>
        </LandingSectionWrapper>
    )
}

export { FeaturesSection }