import { Geist, Quattrocento, Oswald } from 'next/font/google';

import "@/app/globals.css";
import { WithChildren } from "@/features/global/types";
import { cn } from '@/lib/utils';

import type { Metadata } from "next";

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

const geist = Geist({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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

export default function RootLayout({ children }: WithChildren) {
    return (
        <html suppressHydrationWarning>
            <body className={cn("min-h-dvh flex flex-col overflow-x-hidden relative", geist.variable, quattrocento.variable, oswald.variable)}>
                {children}
            </body>
        </html>
    )
}