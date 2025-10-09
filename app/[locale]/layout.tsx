import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import { Footer } from '@/features/footer/components';
import { getCurrentUserAction } from '@/features/global/actions';
import { NextThemeProvider } from '@/features/global/components';
import { LocaleLayoutProps } from '@/features/global/types';
import { Header } from '@/features/header/components';

import type { Metadata } from 'next';

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

async function LocaleLayout({ children, params }: LocaleLayoutProps) {

    const { locale } = await params;
    const { payload: user } = await getCurrentUserAction();

    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NuqsAdapter>
                <NextIntlClientProvider locale={locale}>
                    <Header user={user} />
                    <main>
                        {children}
                    </main>
                    {!user && <Footer />}
                    <Toaster richColors position="top-right" />
                </NextIntlClientProvider>
            </NuqsAdapter>
        </NextThemeProvider>
    );
}

export default LocaleLayout;