import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Toaster } from "@/features/shadcn/components/ui/sonner"
import { GlobalEmailConfirmationDetector } from '@/features/auth/components';
import { FloatingDockContainer } from '@/features/floating-dock/components';
import { Footer } from "@/features/footer/components";
import { Header } from "@/features/header/components";
import { NextThemeProvider, SubdomainProvider } from "@/features/layout/components";
import ChatDoc from "@/features/layout/components/chat-doc";
import { ChatProvider } from "@/features/layout/components/chat-provider";
import { LayoutProps } from "@/features/layout/types";
import { BProgressProvider } from "@/src/components/bprogress-provider";

export default async function RootLayout({ children, params }: LayoutProps) {

  const { locale } = await params;
  
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <NextIntlClientProvider locale={locale}>
          <BProgressProvider options={{ showSpinner: true }} startOnLoad spinnerPosition="bottom-right" shallowRouting={false}>
            <ChatProvider>
              <SubdomainProvider
                adminLayout={(
                  <>
                    <Header />
                    <main className='flex flex-col grow'>
                      {children}
                    </main>
                    <FloatingDockContainer />
                    <Footer />
                    <ChatDoc />
                    <Toaster position="top-center" richColors />
                    {/* <LayoutBackgroundEffects /> */}
                    <GlobalEmailConfirmationDetector />
                  </>
                )}
                userLayout={(
                  <>
                    {children}
                    <ChatDoc />
                    <GlobalEmailConfirmationDetector />
                    <Toaster position="top-center" />
                  </>
                )}
              />
            </ChatProvider>
          </BProgressProvider>
        </NextIntlClientProvider>
      </NuqsAdapter>
    </NextThemeProvider>
  )
}
