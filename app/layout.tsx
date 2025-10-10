import { Metadata } from 'next';
import { Geist } from 'next/font/google';

import '@/app/globals.css';

export const metadata: Metadata = {
    title: 'Lanzate',
    description: 'Lanzate',
};

const geist = Geist({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
            <body className={geist.className}>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;