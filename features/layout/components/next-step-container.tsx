"use client"
import { Calendar, Hand, List, Newspaper, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { NextStep, useNextStep } from "nextstepjs";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode
}

const steps = [
    {
        tour: "mainTour",
        steps: [
            {
                icon: <Hand />,
                title: "Bienvenido a Lanzate!",
                content: "Dale click al botón de abajo para empezar el tour!",
                selector: "#welcome",
                side: "bottom-left" as const,
                showControls: true,
                showSkip: true,

            },
            {
                icon: <Newspaper />,
                title: "Tu Feed",
                content: "Este es tu feed, aqui podras ver las ultimas noticias y actualizaciones de tus tiendas.",
                selector: "#step1",
                side: "right" as const,
                showControls: true,
                showSkip: true,
            },
            {
                icon: <Store />,
                title: "Tus Tiendas",
                content: "En este apartado podras ver todas tus tiendas y administrarlas.",
                selector: "#step2",
                side: "left" as const,
                showControls: true,
                showSkip: true,
            },
            {
                icon: <List />,
                title: "Acciones Rapidas",
                content: "En este apartado podras ver todas tus tiendas y administrarlas.",
                selector: "#step3",
                side: "left" as const,
                showControls: true,
                showSkip: true,
            },
            {
                icon: <Calendar />,
                title: "Calendario",
                content: "En este apartado podras ver todas tus tiendas y administrarlas.",
                selector: "#step4",
                side: "left" as const,
                showControls: true,
                showSkip: true,
            },
        ]
    }
];


const NextStepContainer = ({ children }: Props) => {

    const { startNextStep } = useNextStep();
    const pathname = usePathname();

    useEffect(() => {
        const tourCompleted = localStorage.getItem("tour_completed");
        if (!tourCompleted && pathname.includes("dashboard")) {
            startNextStep("mainTour");
        }
    }, [startNextStep, pathname]);

    const handleComplete = () => {
        console.log("tour completed");
        localStorage.setItem("tour_completed", "true");
    }

    return (
        <NextStep steps={steps} shadowOpacity="0.8" shadowRgb="0,0,0" onComplete={handleComplete} onSkip={handleComplete}>
            {children}
        </NextStep>
    )
}
export default NextStepContainer