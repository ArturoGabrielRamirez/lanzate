import { Geist, Quattrocento, Oswald } from 'next/font/google';

import "@/app/globals.css";
import { RootLayout } from "@/features/global/types";
import { NextThemeProvider } from '@/features/layout/components';
import { BProgressProvider } from "@/features/shadcn/components/bprogress-provider"
import { cn } from '@/lib/utils';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: 'Lanzate',
        template: 'Lanzate | %s',
        absolute: 'Lanzate',
    },
    description: "Elevate your buisness with Lanzate&apos;s all-in-one store management solution.",
    authors: [
        { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
        { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
    ],
};

const geist = Geist({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-geist',
});

const quattrocento = Quattrocento({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-quattrocento',
});

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-oswald',
});

export default async function RootLayout({ children }: RootLayout) {

    const bodyClassName = cn(
        "min-h-dvh flex flex-col overflow-x-hidden relative bg-gradient-to-br from-background to-primary/20",
        geist.variable, quattrocento.variable, oswald.variable
    )

    return (
        <html suppressHydrationWarning>
            <body className={bodyClassName}>
                <NextThemeProvider
                    enableSystem
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                >
                    <BProgressProvider
                        startOnLoad
                        shallowRouting={false}
                        spinnerPosition="bottom-right"
                        options={{ showSpinner: true }}
                    >
                        {children}
                    </BProgressProvider>
                </NextThemeProvider>
            </body>
        </html>
    )
}