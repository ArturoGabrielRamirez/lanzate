import { NextThemeProvider, SubdomainProvider } from "@/features/layout/components";
import { Header, Footer } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import { NextIntlClientProvider } from 'next-intl';
import { NextStepProvider, NextStep } from 'nextstepjs';

import "../globals.css";
import { GlobalEmailConfirmationDetector } from "@/features/auth/components/index";
import { Calendar, Hand, List, Newspaper, Store } from "lucide-react";

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

const steps = [
  {
    tour: "mainTour",
    steps: [
      {
        icon: <Hand />,
        title: "Bienvenido a Lanzate!",
        content: "Dale click al botón de abajo para empezar el tour!",
        selector: "#welcome",
        side: "bottom-left" as const,
        showControls: true,
        showSkip: true,

      },
      {
        icon: <Newspaper />,
        title: "Tu Feed",
        content: "Este es tu feed, aqui podras ver las ultimas noticias y actualizaciones de tus tiendas.",
        selector: "#step1",
        side: "right" as const,
        showControls: true,
        showSkip: true,
      },
      {
        icon: <Store />,
        title: "Tus Tiendas",
        content: "En este apartado podras ver todas tus tiendas y administrarlas.",
        selector: "#step2",
        side: "left" as const,
        showControls: true,
        showSkip: true,
      },
      {
        icon: <List/>,
        title: "Acciones Rapidas",
        content: "En este apartado podras ver todas tus tiendas y administrarlas.",
        selector: "#step3",
        side: "left" as const,
        showControls: true,
        showSkip: true,
      },
      {
        icon: <Calendar />,
        title: "Calendario",
        content: "En este apartado podras ver todas tus tiendas y administrarlas.",
        selector: "#step4",
        side: "left" as const,
        showControls: true,
        showSkip: true,
      },
    ]
  }
];

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
                <NextStep steps={steps} showNextStep={true} shadowOpacity="0.8" shadowRgb="0,0,0">
                  <SubdomainProvider
                    adminLayout={(
                      <>
                        <Header />
                        <main className='flex flex-col overflow-x-hidden overflow-y-hidden grow'>
                          {children}
                        </main>
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
                </NextStep>
              </NextStepProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  )
}