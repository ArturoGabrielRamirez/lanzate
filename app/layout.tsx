import { Metadata } from 'next';
import { Geist, Quattrocento, Oswald } from 'next/font/google';

import '@/app/globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Lanzate | %s',
    description: 'Lanzate',
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