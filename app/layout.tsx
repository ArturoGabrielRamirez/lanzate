import type { Metadata } from "next";
/* import { Geist, Geist_Mono } from "next/font/google"; */
import "./globals.css";
import { Header } from "@/features/header/components";
import { NextThemeProvider } from "@/features/layout/components/theme-provider";

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

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
        className={`min-h-dvh min-w-[270px]`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className='flex flex-col min-h-dvh overflow-y-hidden overflow-x-hidden'>
            <Header />
            {children}
          </main>
        </NextThemeProvider>
      </body>
    </html>
  );
}
