import Link from "next/link";
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { WithClassName } from "@/features/global/types";
import { EyeCatchingButton } from "@/features/landing/components"
import { cn } from "@/lib/utils";

function HeroDescription({ className }: WithClassName) {

    const t = useTranslations('home');

    return (
        <div className={cn("flex flex-col gap-12", className)}>
            <p className="text-lg lg:text-xl text-center md:text-left font-quattrocento text-balance text-primary-foreground">
                {t("description.slogan")}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button variant="outline" className="text-xl font-bold">
                    <Link href="/about">
                        {t('buttons.learn-more')}
                    </Link>
                </Button>
                <EyeCatchingButton asChild className="text-xl font-bold">
                    <Link href="/login">
                        {t('buttons.get-started')}
                    </Link>
                </EyeCatchingButton>
            </div>
        </div>
    )
}

export { HeroDescription }