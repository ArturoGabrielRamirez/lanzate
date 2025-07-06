import type { Metadata } from "next";
import { Header } from "@/features/header/components";
import { NextThemeProvider } from "@/features/layout/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


export const metadata: Metadata = {
  title: 'Lanzate',
  description: 'A customizable E-commerce platform.',
  authors: [
    { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
    { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
          <Header />
          <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
            {children}
          </main>
          <Toaster />
        </NextThemeProvider>
      </body>
    </html>
  );
}
