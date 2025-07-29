import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import EyeCatchingButton from "./eye-catching-button"
import { useTranslations } from "next-intl"
import Link from "next/link";
import { cn } from "@/lib/utils";
type Props = {
    className?: string;
}

function HeroDescription({ className }: Props) {

    const t = useTranslations('home');

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <p className="text-lg lg:text-xl mb-8 text-center md:text-left">
                {t("description.slogan")}
            </p>
            <ul className="flex flex-col gap-2 self-start mb-8">
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>{t("description.slogan-items.1")}</span>
                </li>
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>{t("description.slogan-items.2")}</span>
                </li>
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>{t("description.slogan-items.3")}</span>
                </li>
            </ul>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <EyeCatchingButton asChild className="text-xl font-bold">
                    <Link href="/login">
                        {t('buttons.get-started')}
                    </Link>
                </EyeCatchingButton>
                <Button variant="outline" className="text-xl font-bold">
                    <Link href="/about">
                        {t('buttons.learn-more')}
                    </Link>
                </Button>
            </div>
        </div>
    )
}
export default HeroDescription