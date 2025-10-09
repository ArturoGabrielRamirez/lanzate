"use client";

import { gsap } from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    const t = useTranslations("home");
    const router = useRouter();
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current || !titleRef.current || !subtitleRef.current || !ctaRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                    },
                    "-=0.5"
                )
                .from(
                    ctaRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.6,
                    },
                    "-=0.4"
                );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleGetStartedClick = () => {
        router.push("/signup");
    };

    const handleLearnMoreClick = () => {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="inicio"
            ref={heroRef}
            className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">{t("hero.just_released")}</span>
                </div>

                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                >
                    <span className="text-primary">{t("slogan.1")}</span>{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("slogan.2")}
                    </span>
                    <br />
                    <span className="text-foreground">{t("slogan.3")}</span>{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t("slogan.4")}
                    </span>
                </h1>

                <p
                    ref={subtitleRef}
                    className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                >
                    {t("description.slogan")}
                </p>

                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        size="lg"
                        className="text-lg px-8 py-6 group"
                        onClick={handleGetStartedClick}
                    >
                        {t("buttons.get-started")}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 py-6"
                        onClick={handleLearnMoreClick}
                    >
                        {t("buttons.learn-more")}
                    </Button>
                </div>
            </div>
        </section>
    );
};
