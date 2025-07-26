"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Monitor, Phone, Rocket, Smartphone, Tablet, User } from "lucide-react";



const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] text-primary relative",
                className,
            )}
        >

            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full items-center justify-center p-10",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex size-full max-w-lg flex-col items-center justify-between gap-10">
                <div className="flex flex-col justify-center">
                    <div className="relative hover:scale-110 z-10 transition-all group">
                        <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                        <Circle ref={div7Ref}>
                            <User />
                        </Circle>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="relative hover:scale-110 z-10 transition-all group">
                        <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                        <Circle ref={div6Ref} className="size-16">
                            <Rocket />
                        </Circle>
                    </div>
                </div>
                <div className="flex flex-row justify-center gap-20">
                    <div className="relative hover:scale-110 z-10 transition-all group">
                        <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                        <Circle ref={div2Ref}>
                            <Smartphone />
                        </Circle>
                    </div>
                    <div className="relative hover:scale-110 z-10 transition-all group">
                        <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                        <Circle ref={div3Ref}>
                            <Tablet />
                        </Circle>
                    </div>
                    <div className="relative hover:scale-110 z-10 transition-all group">
                        <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                        <Circle ref={div4Ref}>
                            <Monitor />
                        </Circle>
                    </div>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
            />
        </div>
    );
}