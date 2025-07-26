import { Check } from "lucide-react";
import { AnimatedBeamMultipleOutputDemo } from "@/features/layout/components/hero-image";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { Button, ButtonProps } from "@/components/ui/button"
import Link from "next/link";
import { useTranslations } from "next-intl";


export const EyeCatchingButton_v2 = ({ ...props }: ButtonProps) => {
    return (
        <Button
            {...props}
            className={cn(
                'animate-bg-shine border-[1px] rounded-lg shadow bg-[length:200%_100%] tracking-wide duration-[2200ms]',
                'dark:bg-[linear-gradient(110deg,#09090B,45%,var(--primary),55%,#09090B)] dark:text-zinc-200 dark:border-zinc-800',
                /* 
                'bg-[linear-gradient(110deg,#FFF,45%,#E4E4E7,55%,#FFF)] text-zinc-800 border-zinc-300', */
                /* 'bg-linear-to-br from-transparent to-primary/20', */
                props.className,
            )}
        />
    );
};

export const EyeCatchingButton_v4 = ({ ...props }: ButtonProps) => {
    return (
        <div className="relative group rounded-lg inline-block p-[1.3px] overflow-hidden">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] dark:bg-[conic-gradient(from_90deg_at_50%_50%,var(--primary)_0%,transparent_50%,transparent_100%)] bg-[conic-gradient(from_90deg_at_50%_50%,#52525B_0%,#D4D4D8_50%,#52525B_100%)]" />
            <Button
                {...props}
                className={cn(
                    'backdrop-blur-2xl rounded-lg bg-transparent transition-colors  group-hover:scale-100',
                    props.className,
                )}
            />
        </div>
    );
};

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
                    <EyeCatchingButton_v4 asChild className="text-xl font-bold">
                        <Link href="/login">
                            {t('buttons.get-started')}
                        </Link>
                    </EyeCatchingButton_v4>
                    <Button variant="outline" className="text-xl font-bold">
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