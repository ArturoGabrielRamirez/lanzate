import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingText } from "@/features/global/components";
import { LandingSectionWrapper, SectionHeader, SectionSubtitle } from "@/features/landing/components";
import { AnimatedShinyButton } from "@/features/shadcn/components/animated-shiny-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card";
import { Link } from "@/i18n/naviation";

async function ContactSection() {

    const t = await getTranslations("landing.contact");

    return (
        <LandingSectionWrapper
            id="contact"
            className="flex-col items-center"
        >
            <SectionHeader
                icon={<MessageCircle />}
                labelKey="header.label"
                namespace="landing.contact"
            />
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
        </LandingSectionWrapper>
    )
}

export { ContactSection }