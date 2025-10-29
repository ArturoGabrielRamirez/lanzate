import { Home } from "lucide-react";

import { BackgroundPattern } from "@/features/landing/components"
import { MarqueeLogoScroller } from "@/features/shadcn/components/marquee-logo"

function IntegrationSection() {

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
        <section className="relative pb-17 flex snap-start flex-col items-center">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 z-20 relative">
                    <div>
                        <div className="mb-10 flex items-center gap-2 text-primary">
                            <Home />
                            <h2 className="text-2xl font-bold font-oswald">Integrations</h2>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald">
                            All your favorite tools. One single place.
                        </h2>
                    </div>
                    <p className="text-muted-foreground font-quattrocento">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, vero eius, in quasi hic nemo magnam assumenda accusamus dolorem fugiat quia provident inventore enim vitae nobis? Cupiditate quibusdam saepe temporibus?
                    </p>
                </div>
                <MarqueeLogoScroller
                    title="Trusted by Businesses Worldwide"
                    description="Founders, developers, and business leaders across the globe chose us for their digital asset operations."
                    logos={partners}
                    speed="normal"
                />
            </div>
        </section>
    )
}

export { IntegrationSection }