"use client";
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { useMedia } from "react-use";

const LayoutBackgroundEffects = () => {
    const isMobile = useMedia("(max-width: 768px)");

    return (
        <>
            <Particles
                className="absolute inset-0 blur-xs"
                quantity={isMobile ? 10 : 100}
                ease={300}
                staticity={50}
                color="#ea580c"
                size={1.5}
            />
            <Particles
                className="absolute inset-0 blur-[1px]"
                quantity={isMobile ? 10 : 250}
                ease={200}
                staticity={40}
                color="#ea580c"
                size={1}
            />
            <Particles
                className="absolute inset-0"
                quantity={isMobile ? 10 : 100}
                ease={150}
                staticity={10}
                color="#ea580c"
                size={0.8}
            />
            <BubbleBackground
                interactive
                className="absolute inset-0 flex items-center justify-center opacity-30"
                colors={{
                    fourth: "50, 12, 0",
                    second: "50, 12, 0",
                    sixth: "50, 12, 0",
                    fifth: "50, 12, 0",
                }}
            />
        </>
    );
};

export default LayoutBackgroundEffects;