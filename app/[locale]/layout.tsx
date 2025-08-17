import { NextThemeProvider, SubdomainProvider } from "@/features/layout/components";
import { Header, Footer } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import { NextIntlClientProvider } from 'next-intl';
import "../globals.css";
import { GlobalEmailConfirmationDetector } from "@/features/auth/components/index";
import { NextStepProvider } from "nextstepjs";
import NextStepContainer from "@/features/layout/components/next-step-container";
import FloatingDock from "@/features/header/components/floating-dock";
import { BProgressProvider } from "@/src/components/bprogress-provider";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background";


export const metadata: Metadata = {
  title: {
    default: 'Lanzate',
    template: 'Lanzate | %s',
    absolute: 'Lanzate',
  },
  description: 'A customizable E-commerce platform.',
  authors: [
    { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
    { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
  ],
};


export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col overflow-x-hidden">
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <NextIntlClientProvider locale={locale}>
              <NextStepProvider>
                <NextStepContainer>
                  <BProgressProvider options={{ showSpinner: true }} startOnLoad spinnerPosition="bottom-right" shallowRouting={false}>
                    <SubdomainProvider
                      adminLayout={(
                        <>
                          <Header />
                          <main className='flex flex-col overflow-x-hidden overflow-y-hidden grow min-h-[calc(100dvh-85px)]'>
                            {children}
                          </main>
                          <FloatingDock />
                          <Footer />
                          <Toaster position="top-center" />
                          <Particles
                            className="absolute inset-0 blur-xs"
                            quantity={100}
                            ease={300}
                            staticity={50}
                            color="#ea580c"
                            size={1.5}
                          />
                          <Particles
                            className="absolute inset-0 blur-[1px]"
                            quantity={250}
                            ease={200}
                            staticity={40}
                            color="#ea580c"
                            size={1}
                          />
                          <Particles
                            className="absolute inset-0"
                            quantity={100}
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
                          <GlobalEmailConfirmationDetector />
                        </>
                      )}
                      userLayout={(
                        <>
                          {children}
                          <GlobalEmailConfirmationDetector />
                          <Toaster position="top-center" />
                        </>
                      )}
                    />
                  </BProgressProvider>
                </NextStepContainer>
              </NextStepProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  )
}