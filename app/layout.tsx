import { NextThemeProvider } from "@/features/layout/components";
import { Header } from "@/features/header/components";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { LayoutProps } from "@/features/layout/types";
import "./globals.css";


export const metadata: Metadata = {
  title: 'Lanzate',
  description: 'A customizable E-commerce platform.',
  authors: [
    { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
    { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
  ],
};

export default async function RootLayout({ children }: LayoutProps) {

  return (
    <html lang="en">
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
            <Header />
            <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
              {children}
            </main>
            <Toaster />
          </NuqsAdapter>
        </NextThemeProvider>
      </body>
    </html>
  );
}
