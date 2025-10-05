import { NextThemeProvider } from '@/features/global/components';
import { LocaleLayoutProps } from '@/features/global/types';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { NextIntlClientProvider } from 'next-intl';
import { BProgressProvider } from '@/components/bprogress-provider';

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
                            <BProgressProvider
                                startOnLoad
                                spinnerPosition="bottom-right"
                                shallowRouting={false}
                                options={{ showSpinner: true }}
                            >
                                {children}
                            </BProgressProvider>
                        </NextIntlClientProvider>
                    </NuqsAdapter>
                </NextThemeProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;