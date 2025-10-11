import { Metadata } from 'next';
import { Geist, Quattrocento, Oswald } from 'next/font/google';

import '@/app/globals.css';
import { cn } from '@/lib/utils';

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

export const metadata: Metadata = {
    title: {
        template: 'Lanzate | %s',
        default: 'Lanzate'
    },
    description: 'A customizable E-commerce platform.',
    authors: [
        { name: 'Arturo Gabriel Ramirez', url: 'https://github.com/ArturoGabrielRamirez' },
        { name: 'Horacio Gutierrez Estevez', url: 'https://github.com/HoracioGutierrez' },
    ],
};

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
            <body className={cn(geist.variable, quattrocento.variable, oswald.variable, "snap-mandatory")}>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;