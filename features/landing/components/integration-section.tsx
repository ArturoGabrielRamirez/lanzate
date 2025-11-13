import { Plug } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { BackgroundPattern, SectionSubtitle } from "@/features/landing/components"
import { MarqueeLogoScroller } from "@/features/shadcn/components/marquee-logo"

async function IntegrationSection() {

    const t = await getTranslations("landing.integrations");

    const partners = [
        {
            src: 'https://svgl.app/library/whatsapp-icon.svg',
            alt: 'WhatsApp',
            gradient: { from: '#67F0D1', via: '#2AE5B9', to: '#1B8F72' },
        },
        {
            src: 'https://svgl.app/library/mercado-pago.svg',
            alt: 'Mercado Pago',
            gradient: { from: '#FFE766', via: '#FFCE00', to: '#B38F00' },
        },
        {
            src: 'https://svgl.app/library/drive.svg',
            alt: 'Google Drive',
            gradient: { from: '#6690F0', via: '#255BE3', to: '#193B99' },
        },
        {
            src: 'https://svgl.app/library/facebook-icon.svg',
            alt: 'Facebook',
            gradient: { from: '#668CFF', via: '#0049FF', to: '#003199' }
        },
        {
            src: 'https://svgl.app/library/openai_dark.svg',
            alt: 'OpenAI',
            gradient: { from: '#1F2937', via: '#374151', to: '#111827' },
        },
        {
            src: 'https://svgl.app/library/instagram-icon.svg',
            alt: 'Instagram',
            gradient: { from: '#FF66A1', via: '#FF007A', to: '#B3005A' },
        },
        {
            src: 'https://svgl.app/library/x_dark.svg',
            alt: 'X (formerly Twitter)',
            gradient: { from: '#1F2937', via: '#374151', to: '#111827' },
        },
        {
            src: 'https://svgl.app/library/googleMaps.svg',
            alt: 'Google Maps',
            gradient: { from: '#FF8888', via: '#FF4444', to: '#FF0000' },
        },
    ];

    return (
        <section className="relative pt-17 md:py-17 flex snap-start flex-col items-center" id="integrations">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 z-20 relative items-end mb-10 text-center text-balance md:text-left">
                    <div>
                        <LandingSectionIconTitle icon={<Plug />}>
                            {t('header.label')}
                        </LandingSectionIconTitle>
                        <SectionSubtitle>
                            {t('header.title')}
                        </SectionSubtitle>
                    </div>
                    <LandingText>
                        {t('header.description')}
                    </LandingText>
                </div>
                <MarqueeLogoScroller
                    title={t('marquee.title')}
                    description={t('marquee.description')}
                    logos={partners}
                    speed="normal"
                />
            </div>
        </section>
    )
}

export { IntegrationSection }