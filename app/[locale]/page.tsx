import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

import { FeaturesSection, HeroSection, IntegrationSection, SectionSkeleton } from "@/features/landing/components";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

  const t = await getTranslations("landing.metadata")

  return {
    title: t('title')
  };
}

const FaqSection = dynamic(
  () => import('@/features/landing/components/faq-section').then(m => ({ default: m.FaqSection })),
  { loading: () => <SectionSkeleton /> }
);

const ContactSection = dynamic(
  () => import('@/features/landing/components/contact-section').then(m => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
);

const PricingSection = dynamic(
  () => import('@/features/landing/components/pricing-section').then(m => ({ default: m.PricingSection })),
  { loading: () => <SectionSkeleton /> }
);

export default function Home() {

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <FaqSection />
      <ContactSection />
      <PricingSection />
    </>
  );
}
