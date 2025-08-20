import { NextThemeProvider, SubdomainProvider } from "@/features/layout/components";
import { Header, Footer } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import { NextIntlClientProvider } from 'next-intl';
import { GlobalEmailConfirmationDetector } from "@/features/auth/components/index";
import { BProgressProvider } from "@/src/components/bprogress-provider";
import LayoutBackgroundEffects from "@/features/layout/components/layout-background-effects";
import "../globals.css";
import FloatingDockContainer from "@/features/header/components/foating-dock-container";
import { ChatProvider } from "@/features/layout/components/chat-provider";
import ChatDoc from "@/features/layout/components/chat-doc";


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
      <body className="min-h-dvh flex flex-col overflow-x-hidden relative">
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <NextIntlClientProvider locale={locale}>
              <BProgressProvider options={{ showSpinner: true }} startOnLoad spinnerPosition="bottom-right" shallowRouting={false}>
                <ChatProvider>
                  <SubdomainProvider
                    adminLayout={(
                      <>
                        <Header />
                        <main className='flex flex-col overflow-x-hidden overflow-y-hidden grow'>
                          {children}
                        </main>
                        <FloatingDockContainer />
                        <Footer />
                        <ChatDoc />
                        <Toaster position="top-center" richColors />
                        <LayoutBackgroundEffects />
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
                </ChatProvider>
              </BProgressProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  )
}
