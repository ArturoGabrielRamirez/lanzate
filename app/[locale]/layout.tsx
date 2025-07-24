import { NextThemeProvider } from "@/features/layout/components";
import { Header } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import SubdomainProvider from "@/features/layout/components/subdomain-provider";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing'; // ✅ Importar routing
import { notFound } from 'next/navigation'; // ✅ Importar notFound
/* import { ReactNode } from "react"; */

export const metadata: Metadata = {
  title: 'Lanzate',
  description: 'A customizable E-commerce platform.',
  authors: [
    { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
    { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
  ],
};

/* type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}; */

export default async function RootLayout({ children, params }: LayoutProps) {

  const { locale } = await params;

 /*  if (!hasLocale(routing.locales, locale)) {
    notFound();
  } */

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
              <SubdomainProvider
                adminLayout={(
                  <>
                    <Header />
                    <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
                      {children}
                    </main>
                    <Toaster />
                  </>
                )}
                userLayout={children}
              />
            </NextIntlClientProvider>
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  )
}