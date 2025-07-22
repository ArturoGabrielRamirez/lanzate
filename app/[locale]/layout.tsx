import { NextThemeProvider } from "@/features/layout/components";
import { Header } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import SubdomainProvider from "@/features/layout/components/subdomain-provider";
import "../globals.css";
import { NextIntlClientProvider, Locale, hasLocale } from 'next-intl';
import { I18nProviderClient } from "@/locales/client";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Lanzate',
  description: 'A customizable E-commerce platform.',
  authors: [
    { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
    { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = params;
  return (
    <html lang={locale}>
      <body
        className="min-h-dvh flex flex-col"
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <SubdomainProvider
              adminLayout={(
                <>
                  <I18nProviderClient locale={locale}>
                    <Header />
                    <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
                      {children}
                    </main>
                    <Toaster />
                  </I18nProviderClient>
                </>
              )}
              userLayout={children}
            />
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  );
}
