import Link from "next/link";
import { useTranslations } from "next-intl"

import { ROUTES } from "@/features/global/constants";
import { WithClassName } from "@/features/global/types";
import { AnimatedShinyButton } from "@/features/shadcn/components/animated-shiny-button";
import { Button } from "@/features/shadcn/components/button"
import { cn } from "@/lib/utils";

function HeroDescription({ className }: WithClassName) {

    const t = useTranslations('landing.hero');

    return (
        <div className={cn("flex flex-col gap-12", className)}>
            <p className="text-lg lg:text-xl text-center md:text-left font-quattrocento text-balance">
                {t("description.text")}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Button variant="outline" className="font-bold" size="lg">
                    <Link href={ROUTES.ABOUT}>
                        {t('actions.learnMore')}
                    </Link>
                </Button>
                <AnimatedShinyButton asChild>
                    <Link href={ROUTES.LOGIN}>
                        {t('actions.getStarted')}
                    </Link>
                </AnimatedShinyButton>
            </div>
        </div>
    )
}

export { HeroDescription }