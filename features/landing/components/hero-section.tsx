import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from "next-intl/server";

import { Button } from '@/features/shadcn/components/ui/button';
import { Card } from '@/features/shadcn/components/ui/card';

async function HeroSection() {
  const t = await getTranslations();

  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12 lg:px-16 lg:py-32">
        {/* Left side - Text content */}
        <div className="flex flex-1 flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t('hero.titleBefore')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleAfter')}
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard">
                {t('hero.cta.primary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Link href="#features">
                {t('hero.cta.secondary')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="flex flex-1 items-center justify-center">
          <Card className="relative flex h-100 w-full max-w-md items-center justify-center overflow-hidden border-primary/20 bg-linear-to-br from-primary/5 to-primary/10 shadow-xl md:h-125">
            <div className="flex flex-col items-center gap-6">
              <div className="rounded-2xl bg-primary/20 p-8">
                <Rocket className="h-24 w-24 text-primary" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-4 w-full max-w-50 rounded-full bg-primary/30" />
                <div className="h-4 w-full max-w-40 rounded-full bg-primary/20" />
                <div className="h-4 w-full max-w-30 rounded-full bg-primary/10" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-primary/20 blur-xl opacity-30" />
            <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl opacity-20" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export { HeroSection };