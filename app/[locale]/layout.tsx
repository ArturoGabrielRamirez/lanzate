import { NextThemeProvider } from '@/features/global/components';
import { LocaleLayoutProps } from '@/features/global/types';
import { Header } from '@/features/header/components';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { NextIntlClientProvider } from 'next-intl';
import { BProgressProvider } from '@/components/bprogress-provider';
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

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NuqsAdapter>
                        <NextIntlClientProvider locale={locale}>
                            {/* <BProgressProvider
                                startOnLoad
                                spinnerPosition="bottom-right"
                                shallowRouting={false}
                                options={{ showSpinner: true }}
                            > */}
                                <Header />
                                {children}
                            {/* </BProgressProvider> */}
                        </NextIntlClientProvider>
                    </NuqsAdapter>
                </NextThemeProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;