"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Store, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const HowItWorksSection = () => {
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const features: Feature[] = [
        {
            icon: <Store className="w-16 h-16" />,
            title: t("description.centralize.title"),
            description: t("description.centralize.description"),
        },
        {
            icon: <Package className="w-16 h-16" />,
            title: t("description.sell.title"),
            description: t("description.sell.description"),
        },
        {
            icon: <TrendingUp className="w-16 h-16" />,
            title: t("description.ship-easily.title"),
            description: t("description.ship-easily.description"),
        },
    ];

    const handlePrev = () => emblaApi?.scrollPrev();
    const handleNext = () => emblaApi?.scrollNext();

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", onSelect);
        onSelect();

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".feature-title", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="feature-title text-4xl md:text-5xl font-bold">
                        {t("description.how-it-work.title")}
                    </h2>
                    <p className="feature-title text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("description.how-it-work.description")}
                    </p>
                </div>

                <div className="relative">
                    <div ref={emblaRef} className="overflow-hidden">
                        <div className="flex">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-4"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="text-primary mb-6 flex justify-center">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-center">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground text-center leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            className="rounded-full"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === selectedIndex
                                            ? "bg-primary w-8"
                                            : "bg-muted-foreground/30"
                                    }`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            className="rounded-full"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
