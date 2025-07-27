import { Check } from "lucide-react";
import { AnimatedBeamMultipleOutputDemo } from "@/features/layout/components/hero-image";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useTranslations } from "next-intl";
import EyeCatchingButton from "./eye-catching-button";
import HeroDescription from "./hero-description";


function HeroSection() {

    const t = useTranslations('home');
    const words = ["soñá", "emprende", "crecé"]

    return (
        <section className="flex flex-col md:grid md:grid-cols-[auto_auto] md:gap-10 xl:gap-20 2xl:gap-56 min-h-dvh justify-center items-center relative pt-17 px-4 lg:px-0">
            <div className="flex flex-col items-center md:items-start xl:max-w-2xl pt-4 md:pt-0">
                <p className="text-sm font-medium bg-primary/20 text-primary-foreground px-2 py-1 rounded-full border-primary border line-clamp-1 mb-8 md:mb-4">
                    Just released: Enhanced customization and new components
                </p>
                <h1 className="text-4xl font-bold leading-none sm:text-6xl flex flex-col gap-2 justify-end mb-0 md:mb-8 text-center md:text-left">
                    <span className="flex flex-col items-center md:flex-row gap-2 md:gap-4">Vos <ContainerTextFlip words={words} className="text-5xl mx-auto md:mx-0" /></span>
                    <span className="text-primary">Lanzate lo hace posible</span>
                </h1>
                <HeroDescription className="hidden md:block" />
            </div>
            <AnimatedBeamMultipleOutputDemo />
            <HeroDescription className="block md:hidden" />
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