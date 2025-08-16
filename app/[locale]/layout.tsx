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
      <body className="min-h-dvh flex flex-col">
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
                  <BProgressProvider>
                    <SubdomainProvider
                      adminLayout={(
                        <>
                          <Header />
                          <main className='flex flex-col overflow-x-hidden overflow-y-hidden grow'>
                            {children}
                          </main>
                          <FloatingDock />
                          <Footer />
                          <Toaster position="top-center" />
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