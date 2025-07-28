"use client";

import React, { forwardRef, useRef, useState, useEffect, useCallback, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Monitor, Rocket, Smartphone, Tablet, User, Check } from "lucide-react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

import type { Variants } from 'motion/react';
import { useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
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



export interface RocketIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface RocketIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const variants: Variants = {
    normal: {
        x: 0,
        y: 0,
    },
    animate: {
        x: [0, 0, -3, 2, -2, 1, -1, 0],
        y: [0, -3, 0, -2, -3, -1, -2, 0],
        transition: {
            duration: 6,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
            times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        },
    },
};

const fireVariants: Variants = {
    normal: {
        d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
    },
    animate: {
        d: [
            'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
            'M4.5 16.5c-1.5 1.26-3 5.5-3 5.5s4.74-1 6-2.5c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
            'M4.5 16.5c-1.5 1.26-2.2 4.8-2.2 4.8s3.94-0.3 5.2-1.8c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
            'M4.5 16.5c-1.5 1.26-2.8 5.2-2.8 5.2s4.54-0.7 5.8-2.2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
            'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
        ],
        transition: {
            duration: 2,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
            times: [0, 0.2, 0.5, 0.8, 1],
        },
    },
};

const RocketIcon = forwardRef<RocketIconHandle, RocketIconProps>(
    ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;

            return {
                startAnimation: () => controls.start('animate'),
                stopAnimation: () => controls.start('normal'),
            };
        });

        const handleMouseEnter = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlledRef.current) {
                    controls.start('animate');
                } else {
                    onMouseEnter?.(e);
                }
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlledRef.current) {
                    controls.start('normal');
                } else {
                    onMouseLeave?.(e);
                }
            },
            [controls, onMouseLeave]
        );

        return (
            <div
                className={cn(className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={variants}
                    animate={controls}
                >
                    <motion.path
                        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                        variants={fireVariants}
                        animate={controls}
                    />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </motion.svg>
            </div>
        );
    }
);

RocketIcon.displayName = 'RocketIcon';

export { RocketIcon };


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

// Sale Toast component for single notification
function SaleToastSingle({ message, amount, isVisible }: { message: string; amount: string; isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute top-[0px] left-22 flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-white/10 backdrop-blur-md shadow-lg w-max"
                    initial={{ scale: 0, x: -20, opacity: 0 }}
                    animate={{ scale: 1, x: 0, opacity: 1 }}
                    exit={{ scale: 0, x: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    {/* Speech bubble tail */}
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white/10"></div>
                        <div className="absolute -left-[1px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-border/50"></div>
                    </div>

                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 backdrop-blur-sm">
                        <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <div className="">
                        <p className="text-sm font-semibold text-white/90">{message}</p>
                        <p className="text-xs text-white/70">{amount}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
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
    const rocketIconRef = useRef<RocketIconHandle>(null); // Rocket icon animation control

    // Animation state
    const [currentDevice, setCurrentDevice] = useState(0); // 0: smartphone, 1: tablet, 2: monitor
    const [animationStep, setAnimationStep] = useState(0); // 0: device, 1: rocket, 2: user
    const [showSaleToast, setShowSaleToast] = useState(false); // Control single toast visibility
    const [currentSaleIndex, setCurrentSaleIndex] = useState(0); // Track which sale to show

    const devices = ['smartphone', 'tablet', 'monitor'];

    // Sale messages array
    const salesData = [
        { message: "New sale!", amount: "$89.99" },
        { message: "Product sold!", amount: "$156.50" },
        { message: "Sale completed!", amount: "$43.25" },
        { message: "New purchase!", amount: "$267.80" },
        { message: "Order received!", amount: "$92.15" },
        { message: "Payment processed!", amount: "$134.60" },
        { message: "Sale confirmed!", amount: "$78.30" }
    ];

    // Determine which circles should be active
    const isDeviceActive = (deviceIndex: number) =>
        currentDevice === deviceIndex && animationStep >= 0;

    const isRocketActive = animationStep >= 1;
    const isUserActive = animationStep >= 2;

    // Control rocket animation based on rocket active state
    useEffect(() => {
        if (isRocketActive && rocketIconRef.current) {
            rocketIconRef.current.startAnimation();
        } else if (!isRocketActive && rocketIconRef.current) {
            rocketIconRef.current.stopAnimation();
        }
    }, [isRocketActive]);

    useEffect(() => {
        const animationCycle = () => {
            // Reset all - start with everything off
            setAnimationStep(-1);
            setShowSaleToast(false);

            // After 0.5 seconds, light up device
            setTimeout(() => setAnimationStep(0), 500);

            // After 1.5 seconds, light up rocket
            setTimeout(() => setAnimationStep(1), 1500);

            // After 2.5 seconds, light up user and show sale toast
            setTimeout(() => {
                setAnimationStep(2);
                setShowSaleToast(true);
                setCurrentSaleIndex(prev => (prev + 1) % salesData.length);
            }, 2500);

            // After 3.5 seconds, hide sale toast
            setTimeout(() => setShowSaleToast(false), 4000);

            // After 4 seconds, turn everything off and move to next device
            setTimeout(() => {
                setAnimationStep(-1);
                setCurrentDevice((prev) => (prev + 1) % devices.length);
            }, 4000);
        };

        // Start the animation immediately
        animationCycle();

        // Repeat every 4.5 seconds
        const interval = setInterval(animationCycle, 4500);

        return () => clearInterval(interval);
    }, [devices.length, salesData.length]);

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative flex lg:h-[500px] w-full items-center justify-center p-10 z-10 ",
                    className,
                )}
                ref={containerRef}
            >
                <div className="flex size-full max-w-lg flex-col items-center justify-between gap-10">
                    <div className="flex flex-col justify-center">
                        <div className="relative z-10 group">
                            <AnimatePresence>
                                {isUserActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary/30 blur-xl transition-all"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <FollowerPointerCard title="Users won't stop buying!">
                                <Circle ref={div7Ref} isActive={isUserActive} className="size-12 lg:size-16">
                                    <User />
                                </Circle>
                            </FollowerPointerCard>

                            <SaleToastSingle
                                message={salesData[currentSaleIndex].message}
                                amount={salesData[currentSaleIndex].amount}
                                isVisible={showSaleToast}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="relative z-10 group">
                            <AnimatePresence>
                                {isRocketActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary/30 blur-xl transition-all"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <FollowerPointerCard title="Lanzate makes it easy to sell">
                                <Circle ref={div6Ref} className="size-12 lg:size-16" isActive={isRocketActive}>
                                    <RocketIcon ref={rocketIconRef} />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-10 lg:gap-20">
                        <div className="relative z-50 group">
                            <AnimatePresence>
                                {isDeviceActive(0) && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary/30 blur-xl transition-all"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <FollowerPointerCard title="Outage problems? Use it in your phone!">
                                <Circle ref={div2Ref} isActive={isDeviceActive(0)} className="size-12 lg:size-16">
                                    <Smartphone />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                        <div className="relative hover:scale-110 z-40 transition-all group">
                            <AnimatePresence>
                                {isDeviceActive(1) && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary/30 blur-xl transition-all"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <FollowerPointerCard title="Available on any device!">
                                <Circle ref={div3Ref} isActive={isDeviceActive(1)} className="size-12 lg:size-16">
                                    <Tablet />
                                </Circle>
                            </FollowerPointerCard>
                        </div>
                        <div className="relative hover:scale-110 z-30 transition-all group">
                            <AnimatePresence>
                                {isDeviceActive(2) && (
                                    <motion.div
                                        className="absolute inset-0 bg-primary/30 blur-xl transition-all"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <FollowerPointerCard title="Benefit from our USB Barcode Scanner!">
                                <Circle ref={div4Ref} isActive={isDeviceActive(2)} className="size-12 lg:size-16">
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
        </div>
    );
}