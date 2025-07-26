"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Monitor, Rocket, Smartphone, Tablet, User, Check } from "lucide-react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

import { AnimatedList } from "@/components/magicui/animated-list";

// Animation variants for circles
const circleVariants = {
    inactive: {
        opacity: 0.3,
        scale: 1,
        filter: "brightness(0.5)",
        transition: { duration: 0.3 }
    },
    active: {
        opacity: 1,
        scale: 1.1,
        filter: "brightness(1)",
        transition: {
            duration: 0.4,
            type: "spring" as const,
            stiffness: 300,
            damping: 20
        }
    }
};

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode; isActive?: boolean }
>(({ className, children, isActive = false }, ref) => {
    return (
        <motion.div
            ref={ref}
            className={cn(
                "z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] text-primary relative",
                className,
            )}
            variants={circleVariants}
            animate={isActive ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
        >
            {children}
        </motion.div>
    );
});

Circle.displayName = "Circle";

// Sale Toast component for the animated list
function SaleToast({ message, amount }: { message: string; amount: string }) {
    return (
        <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-white/10 backdrop-blur-md shadow-lg"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 backdrop-blur-sm">
                <Check className="w-3 h-3 text-green-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-white/90">{message}</span>
                <span className="text-xs text-white/70">{amount}</span>
            </div>
        </motion.div>
    );
}

export function AnimatedBeamMultipleOutputDemo({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null); // Smartphone
    const div3Ref = useRef<HTMLDivElement>(null); // Tablet  
    const div4Ref = useRef<HTMLDivElement>(null); // Monitor
    const div6Ref = useRef<HTMLDivElement>(null); // Rocket
    const div7Ref = useRef<HTMLDivElement>(null); // User

    // Animation state
    const [currentDevice, setCurrentDevice] = useState(0); // 0: smartphone, 1: tablet, 2: monitor
    const [animationStep, setAnimationStep] = useState(0); // 0: device, 1: rocket, 2: user
    const [listIndex, setListIndex] = useState(-1); // Control AnimatedList

    const devices = ['smartphone', 'tablet', 'monitor'];

    useEffect(() => {
        const animationCycle = () => {
            // Reset all - start with everything off
            setAnimationStep(-1);

            // After 0.5 seconds, light up device
            setTimeout(() => setAnimationStep(0), 500);

            // After 1.5 seconds, light up rocket
            setTimeout(() => setAnimationStep(1), 1500);

            // After 2.5 seconds, light up user and show first list item
            setTimeout(() => {
                setAnimationStep(2);
                setListIndex(prev => prev + 1);
            }, 2500);

            // After 3.5 seconds, turn everything off
            setTimeout(() => setAnimationStep(-1), 3500);

            // After 4 seconds, move to next device and start cycle again
            setTimeout(() => {
                setCurrentDevice((prev) => (prev + 1) % devices.length);
            }, 4000);
        };

        // Start the animation immediately
        animationCycle();

        // Repeat every 4.5 seconds
        const interval = setInterval(animationCycle, 4500);

        return () => clearInterval(interval);
    }, [devices.length]);

    // Determine which circles should be active
    const isDeviceActive = (deviceIndex: number) =>
        currentDevice === deviceIndex && animationStep >= 0;

    const isRocketActive = animationStep >= 1;
    const isUserActive = animationStep >= 2;

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative flex h-[500px] w-full items-center justify-center p-10 z-10 ",
                    className,
                )}
                ref={containerRef}
            >
                <div className="flex size-full max-w-lg flex-col items-center justify-between gap-10">
                    <div className="flex flex-col justify-center">
                        <div className="relative z-10 group">
                            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                            <FollowerPointerCard title="Users won't stop buying!">
                                <Circle ref={div7Ref} isActive={isUserActive}>
                                    <User />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="relative z-10 group">
                            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                            <FollowerPointerCard title="Lanzate makes it easy to sell">
                                <Circle ref={div6Ref} className="size-16" isActive={isRocketActive}>
                                    <Rocket />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-20">
                        <div className="relative z-50 group">
                            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                            <FollowerPointerCard title="Outage problems? Use it in your phone!">
                                <Circle ref={div2Ref} isActive={isDeviceActive(0)}>
                                    <Smartphone />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                        <div className="relative hover:scale-110 z-40 transition-all group">
                            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                            <FollowerPointerCard title="Available on any device!">
                                <Circle ref={div3Ref} isActive={isDeviceActive(1)}>
                                    <Tablet />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                        <div className="relative hover:scale-110 z-30 transition-all group">
                            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:blur-2xl transition-all"></div>
                            <FollowerPointerCard title="Benefit from our USB Barcode Scanner!">
                                <Circle ref={div4Ref} isActive={isDeviceActive(2)}>
                                    <Monitor />
                                </Circle>
                            </FollowerPointerCard>
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
            <AnimatedList externalIndex={listIndex} maxVisible={5} className="absolute top-0 -right-50 z-0 ">
                <SaleToast message="New sale!" amount="$89.99" />
                <SaleToast message="Product sold!" amount="$156.50" />
                <SaleToast message="Sale completed!" amount="$43.25" />
                <SaleToast message="New purchase!" amount="$267.80" />
                <SaleToast message="Order received!" amount="$92.15" />
                <SaleToast message="Payment processed!" amount="$134.60" />
                <SaleToast message="Sale confirmed!" amount="$78.30" />
            </AnimatedList>
        </div>
    );
}