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
                Gestionar tu negocio online nunca fue tan fácil. Enfocate en crecer mientras te damos el control total:
            </p>
            <ul className="flex flex-col gap-2 self-start mb-8">
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>gestioná tus productos</span>
                </li>
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>procesá ventas</span>
                </li>
                <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>organizá a tu equipo de trabajo</span>
                </li>
            </ul>
            <div className="flex flex-wrap justify-center gap-4">
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