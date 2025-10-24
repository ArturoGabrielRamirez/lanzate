import Link from "next/link";
import { useTranslations } from "next-intl"

import { WithClassName } from "@/features/global/types";
import { AnimatedShinyButton } from "@/features/shadcn/components/animated-shiny-button";
import { Button } from "@/features/shadcn/components/ui/button"
import { cn } from "@/lib/utils";

function HeroDescription({ className }: WithClassName) {

    const t = useTranslations('home');

    return (
        <div className={cn("flex flex-col gap-12", className)}>
            <p className="text-lg lg:text-xl text-center md:text-left font-quattrocento text-balance text-primary-foreground">
                {t("description.slogan")}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button variant="outline" className="text-xl font-bold" size="lg">
                    <Link href="/about">
                        {t('buttons.learn-more')}
                    </Link>
                </Button>
                <AnimatedShinyButton asChild>
                    <Link href="/login">
                        {t('buttons.get-started')}
                    </Link>
                </AnimatedShinyButton>
            </div>
        </div>
    )
}

export { HeroDescription }