import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from "next-intl/server";

import HeroImage from '@/features/landing/assets/hero-section.svg';
import { Button } from '@/features/shadcn/components/ui/button';

async function HeroSection() {
  const t = await getTranslations();

  return (
    <div className="relative w-full">
      <div className="mx-auto md:grid md:grid-cols-2 container items-end">

        {/* Left side - Text content */}
        <div className="flex flex-1 flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-7xl">
              {t('hero.titleBefore')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleAfter')}
            </h2>

            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="default"
              className="group gap-2 text-primary-foreground"
            >
              <Link href="/dashboard">
                {t('hero.cta.primary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <Link href="#features">
                {t('hero.cta.secondary')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end relative grow h-full aspect-560/560 justify-self-end w-full max-w-160 max-h-160">
          <Image
            src={HeroImage}
            alt={t('hero.imageAlt')}
            fill
            priority
          />
          {/* Decorative elements */}
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-primary/50 blur-xl opacity-30" />
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary/50 blur-2xl opacity-20" />
        </div>
      </div>
    </div>
  );
}

export { HeroSection };