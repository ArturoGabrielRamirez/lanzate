import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { BackgroundPattern, SectionSubtitle } from "@/features/landing/components";
import { AnimatedShinyButton } from "@/features/shadcn/components/animated-shiny-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card";
import { Link } from "@/i18n/naviation";

async function ContactSection() {

    const t = await getTranslations("landing.contact");

    return (
        <section className="relative pt-17 md:py-17 flex snap-start flex-col items-center" id="contact">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <LandingSectionIconTitle icon={<MessageCircle />}>
                    {t('header.label')}
                </LandingSectionIconTitle>
                <Card className="relative z-20">
                    <CardHeader>
                        <CardTitle>
                            <SectionSubtitle className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald text-center">
                                {t('header.title')}
                            </SectionSubtitle>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <LandingText>
                            {t('header.description')}
                        </LandingText>
                        <AnimatedShinyButton asChild>
                            <Link href="/help">
                                {t("actions.button")}
                            </Link>
                        </AnimatedShinyButton>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export { ContactSection }