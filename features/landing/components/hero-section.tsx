import { Check } from "lucide-react";
import { AnimatedBeamMultipleOutputDemo } from "@/features/layout/components/hero-image";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useTranslations } from "next-intl";

function HeroSection() {

    const t = useTranslations('home');
    const words = ["soñá", "emprende", "crecé"]

    return (
        <section className="flex flex-col md:grid md:grid-cols-[auto_auto] md:gap-10 xl:gap-20 2xl:gap-56 min-h-dvh justify-center items-center relative">
            <div className="flex flex-col gap-4 items-start xl:max-w-2xl">
                <p className="text-sm font-medium bg-primary/20 text-primary-foreground px-2 py-1 rounded-full border-primary border">Just released: Enhanced customization and new components</p>
                <h1 className="text-4xl font-bold leading-none sm:text-6xl flex flex-col gap-2">
                    <span>Vos <ContainerTextFlip words={words} /></span>
                    <span className="text-primary">Lanzate lo hace posible.</span>
                </h1>
                <p className="text-xl mb-8">
                    Gestionar tu negocio online nunca fue tan fácil. Enfocate en crecer mientras te damos el control total:
                </p>
                <ul className="flex flex-col gap-2">
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
                    <Button asChild>
                        <Link href="/login">
                            {t('buttons.get-started')}
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/about">
                            {t('buttons.learn-more')}
                        </Link>
                    </Button>
                </div>
            </div>
            <AnimatedBeamMultipleOutputDemo />
            <DotPattern
                width={30}
                height={30}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ",
                )}
            />
        </section>
    )
}
export default HeroSection