'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Home, Settings, TabletSmartphone } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from './magicui/border-beam'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')
    const t = useTranslations('home')

    const images = {
        'item-1': {
            image: '/landing/feature-1.png',
            alt: 'Database visualization',
        },
        'item-2': {
            image: '/landing/feature-2.png',
            alt: 'Security authentication',
        },
        'item-3': {
            image: '/landing/feature-3.png',
            alt: 'Identity management',
        },
        'item-4': {
            image: '/landing/feature-4.png',
            alt: 'Analytics dashboard',
        },
    }

    return (
        <div className="py-12 md:py-20 lg:py-32 relative pb-0">
            <div className="bg-linear-to-b absolute inset-0 -z-10 dark:block dark:to-[color-mix(in_oklab,var(--color-black),var(--color-black))] to-background w-full backdrop-blur-xl"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl text-primary">How it works</h2>
                    <p className='text-balance text-lg lg:text-xl'>With <span className="text-primary">Lanzate</span> you can easily create and manage your stores, products, orders, and more. We provide you with the tools to help you grow your business.
                    </p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className={cn(activeItem === 'item-1' && 'text-primary')}>
                                <div className="flex items-center gap-2 text-lg">
                                    <Home className="size-4" />
                                    {t('description.centralize.title')}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>{t('description.centralize.description')} Just log into your account and start creating your stores and products straigth from your bed!</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className={cn(activeItem === 'item-2' && 'text-primary')}>
                                <div className="flex items-center gap-2 text-lg">
                                    <TabletSmartphone className="size-4" />
                                    {t('description.ship-easily.title')}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>{t('description.ship-easily.description')} Same information in every device for your convenience.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className={cn(activeItem === 'item-3' && 'text-primary')}>
                                <div className="flex items-center gap-2 text-lg">
                                    <Settings className="size-4" />
                                    {t('description.sell.title')}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>{t('description.sell.description')} Customize your store to your liking and see the magic happen.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className={cn(activeItem === 'item-4' && 'text-primary')}>
                                <div className="flex items-center gap-2 text-lg">
                                    <ChartBarIncreasingIcon className="size-4" />
                                    Analytics Dashboard
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Get the best out of your store with our AI analytics and insights.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-black/50 relative flex overflow-hidden rounded-3xl border p-2">
                        <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                        <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <Image
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                        width={1207}
                                        height={929}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            duration={20}
                            size={200}
                            className="from-transparent via-yellow-700 to-transparent dark:via-white/80"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
