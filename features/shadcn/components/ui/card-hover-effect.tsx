"use client"

import { Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { EyeCatchingButton } from "@/features/landing/components";
import { cn } from "@/lib/utils";

export function HoverEffect({
  items,
  className,
}: {
  items: {
    title: string;
    price: string;
    originalPrice?: string;
    priceDescription: string;
    benefits: string[];
    buttonText: string;
    link: string;
    id: number;
  }[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {items.map((item, idx) => (
        <motion.div
          key={item?.id}
          className={cn("relative group block p-4 h-full w-full", idx === 2 && "md:col-span-2 lg:col-span-1")}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(0)}
          variants={{
            hidden: {
              opacity: 0,
              y: 50,
              scale: 0.9
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
            },
          }}
        >
          {/* <AnimatePresence> */}
          {hoveredIndex === idx && (
            <motion.span
              className="absolute inset-0 h-full w-full bg-primary dark:bg-primary/[0.8] block  rounded-xl -z-10"
              layoutId="hoverBackground"
              /* initial={{ opacity: 0 }} */
              animate={{
                opacity: 1,
                transition: { duration: 0.15 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            >
              <span className="absolute inset-0 h-full w-full bg-primary dark:bg-primary/[0.8] block  rounded-xl -z-10 blur-xl" />
            </motion.span>
          )}
          {/* </AnimatePresence> */}
          <PricingCard>
            <PricingCardTitle>{item.title}</PricingCardTitle>
            <PricingCardPrice
              price={item.price}
              originalPrice={item.originalPrice}
              priceDescription={item.priceDescription}
            />
            <PricingCardBenefits benefits={item.benefits} />
            <PricingCardButton href={item.link}>
              {item.buttonText}
            </PricingCardButton>
          </PricingCard>
        </motion.div>
      ))}
    </motion.div>
  );
};

function PricingCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-0 flex flex-col items-center p-8 border rounded-md h-full bg-background group-hover:border-primary duration-200 hover:scale-110 transition-all dark:hover:bg-black",
        className
      )}
    >
      <div className="relative z-50 flex flex-col items-center h-full">
        {children}
      </div>
    </div>
  );
};

function PricingCardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("absolute -top-10 px-6 pt-1 pb-2 font-medium rounded-b-lg bg-primary", className)}>
      {children}
    </span>
  );
};

function PricingCardPrice({
  price,
  originalPrice,
  priceDescription,
  className,
}: {
  price: string;
  originalPrice?: string;
  priceDescription: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center my-6 space-x-2 font-bold", className)}>
      {originalPrice && (
        <span className="text-lg line-through text-muted-foreground/50">
          &nbsp;{originalPrice}&nbsp;
        </span>
      )}
      <span className="pb-2 text-4xl">{price}</span>
      <span className="text-lg">{priceDescription}</span>
    </div>
  );
};

function PricingCardBenefits({
  benefits,
  className,
}: {
  benefits: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex-1 space-y-2 mb-8", className)}>
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
};

function PricingCardButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <EyeCatchingButton asChild className={cn("text-xl font-bold", className)}>
      <Link href={href}>
        {children}
      </Link>
    </EyeCatchingButton>
  );
};
