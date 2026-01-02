import * as motion from "motion/react-client"
import { Card } from '@/features/shadcn/components/ui/card';
import { Button } from '@/features/shadcn/components/ui/button';
import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from "next-intl/server";

async function HeroSection() {
  const t = await getTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12 lg:px-16 lg:py-32">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-8 text-center md:text-left"
        >
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {t('hero.titleBefore')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleAfter')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
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
          </motion.div>
        </motion.div>

        {/* Right side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-1 items-center justify-center"
        >
          <Card className="relative flex h-[400px] w-full max-w-md items-center justify-center overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl md:h-[500px]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: 'easeOut',
              }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="rounded-2xl bg-primary/20 p-8"
              >
                <Rocket className="h-24 w-24 text-primary" />
              </motion.div>
              
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-4 w-full max-w-[200px] rounded-full bg-primary/30"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-4 w-full max-w-[160px] rounded-full bg-primary/20"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="h-4 w-full max-w-[120px] rounded-full bg-primary/10"
                />
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-10 top-10 h-20 w-20 rounded-full bg-primary/20 blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl"
            />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export { HeroSection };