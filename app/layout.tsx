import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Lanzate',
    description: 'Lanzate',
};

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;