import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Nav/NavBar";
import { createClient } from "@/utils/supabase/server-props";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} min-w-[270px]`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh min-w-[270px]`}
      >
        <main className='flex flex-col min-h-dvh overflow-y-hidden overflow-x-hidden'>
          <NavBar user={user} />
          {children}
        </main>
      </body>
    </html>
  );
}
