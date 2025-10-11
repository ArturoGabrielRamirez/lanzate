"use client";

import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import type { FAQ } from '@/features/landing/types';

gsap.registerPlugin(ScrollTrigger);

function FAQSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    // Define FAQs (you can add these to your translations later)
    const faqGroups: FAQ[][] = [
        [
            {
                question: "¿Qué es Lanzate?",
                answer: "Lanzate es una plataforma completa de e-commerce que te permite gestionar tu tienda online, productos, inventario y ventas desde un solo lugar.",
            },
            {
                question: "¿Cómo empiezo?",
                answer: "Simplemente regístrate, crea tu tienda, añade tus productos y comienza a vender. Es así de fácil.",
            },
            {
                question: "¿Necesito conocimientos técnicos?",
                answer: "No, Lanzate está diseñado para ser intuitivo y fácil de usar, incluso sin conocimientos técnicos previos.",
            },
        ],
        [
            {
                question: "¿Puedo tener múltiples tiendas?",
                answer: "Sí, dependiendo de tu plan puedes gestionar varias tiendas y sucursales desde una sola cuenta.",
            },
            {
                question: "¿Cómo proceso los pagos?",
                answer: "Lanzate soporta múltiples métodos de pago incluyendo efectivo, tarjetas, transferencias y plataformas como Mercado Pago.",
            },
            {
                question: "¿Hay soporte al cliente?",
                answer: "Sí, ofrecemos soporte a través de email y chat. Los planes profesionales y empresariales tienen soporte prioritario.",
            },
        ],
        [
            {
                question: "¿Puedo personalizar mi tienda?",
                answer: "Absolutamente, puedes personalizar colores, logos, banners y obtener tu propio dominio personalizado.",
            },
            {
                question: "¿Hay límite de productos?",
                answer: "Depende de tu plan. El plan gratuito permite hasta 200 productos, mientras que el plan empresarial es ilimitado.",
            },
            {
                question: "¿Cómo cancelo mi suscripción?",
                answer: "Puedes cancelar tu suscripción en cualquier momento desde tu panel de control sin cargos adicionales.",
            },
        ],
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
            gsap.from(".faq-title", {
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
        <section id="pricing" ref={sectionRef} className="py-20 px-4 bg-background">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="faq-title text-4xl md:text-5xl font-bold">
                        Preguntas Frecuentes
                    </h2>
                    <p className="faq-title text-xl text-muted-foreground">
                        Encuentra respuestas a las preguntas más comunes
                    </p>
                </div>

                <div className="relative px-12">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 8000,
                                stopOnInteraction: true,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {faqGroups.map((group, groupIndex) => (
                                <CarouselItem key={groupIndex}>
                                    <div className="p-4">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full space-y-4"
                                        >
                                            {group.map((faq, index) => (
                                                <AccordionItem
                                                    key={index}
                                                    value={`item-${groupIndex}-${index}`}
                                                    className="border border-border rounded-lg px-6 bg-card"
                                                >
                                                    <AccordionTrigger className="text-left hover:no-underline py-6">
                                                        <span className="text-lg font-semibold">
                                                            {faq.question}
                                                        </span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground pb-6">
                                                        {faq.answer}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="rounded-full" />
                        <CarouselNext className="rounded-full" />
                    </Carousel>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {faqGroups.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === current
                                    ? "bg-primary w-8"
                                    : "bg-muted-foreground/30 w-2"
                                    }`}
                                aria-label={`Go to FAQ group ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export { FAQSection };