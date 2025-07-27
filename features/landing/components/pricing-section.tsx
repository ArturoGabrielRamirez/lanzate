import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import * as motion from "motion/react-client"

import { useTranslations } from "next-intl";
import { EyeCatchingButton_v4 } from "./hero-section";
import Link from "next/link";
import { Check } from "lucide-react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

function PricingSection() {

    const t = useTranslations('home');

    const pricingPlans = [
        {
            title: t('description.plan.personal.title'),
            price: t('description.plan.personal.price'),
            priceDescription: "",
            benefits: [
                t('description.plan.personal.benefits.1'),
                t('description.plan.personal.benefits.2'),
                t('description.plan.personal.benefits.3'),
                t('description.plan.personal.benefits.4'),
                t('description.plan.personal.benefits.5'),
            ],
            buttonText: t('buttons.subscribe'),
            link: "/login"
        },
        {
            title: t('description.plan.professional.title'),
            price: "$10",
            originalPrice: "$12",
            priceDescription: t('description.plan.professional.price'),
            benefits: [
                t('description.plan.professional.benefits.1'),
                t('description.plan.professional.benefits.2'),
                t('description.plan.professional.benefits.3'),
                t('description.plan.professional.benefits.4'),
                t('description.plan.professional.benefits.5'),
                t('description.plan.professional.benefits.6'),
            ],
            buttonText: t('buttons.subscribe'),
            link: "/login"
        },
        {
            title: t('description.plan.enterprise.title'),
            price: "$30",
            originalPrice: "$40",
            priceDescription: t('description.plan.enterprise.price'),
            benefits: [
                t('description.plan.enterprise.benefits.1'),
                t('description.plan.enterprise.benefits.2'),
                t('description.plan.enterprise.benefits.3'),
                t('description.plan.enterprise.benefits.4'),
                t('description.plan.enterprise.benefits.5'),
                t('description.plan.enterprise.benefits.6'),
                t('description.plan.enterprise.benefits.7'),
            ],
            buttonText: t('buttons.subscribe'),
            link: "/login"
        }
    ];

    return (
        <section className="py-6 relative">
            <div className="container mx-auto p-4 sm:p-10">
                <div className="mb-16 space-y-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                        className="text-5xl font-bold text-center"
                    >
                        {t('description.plan.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-muted-foreground/50 max-w-3xl mx-auto"
                    >
                        {t('description.plan.description')}
                    </motion.p>
                </div>
                <div className="flex justify-center mb-8">
                    <button className="px-4 py-1 font-semibold border rounded-l-lg bg-primary border-primary">{t('buttons.monthly')}</button>
                    <button className="px-4 py-1 border rounded-r-lg border-primary">{t('buttons.annually')}</button>
                </div>
                <HoverEffect
                    items={pricingPlans}
                    className="max-w-md mx-auto lg:max-w-full"
                />
            </div>
            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_left,white,transparent_70%,transparent)] ",
                )}
            />
        </section>
    )
}
export default PricingSection