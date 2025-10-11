"use client";

import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Store, Package, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import type { Feature } from '@/features/landing/types';

gsap.registerPlugin(ScrollTrigger);

function HowItWorksSection() {
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLElement>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

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

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

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

                <div className="relative px-12">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 5000,
                                stopOnInteraction: false,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {features.map((feature, index) => (
                                <CarouselItem
                                    key={index}
                                    className="md:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-4">
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
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="rounded-full" />
                        <CarouselNext className="rounded-full" />
                    </Carousel>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === current
                                        ? "bg-primary w-8"
                                        : "bg-muted-foreground/30 w-2"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
    };

export { HowItWorksSection };