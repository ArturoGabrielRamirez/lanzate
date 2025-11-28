import { NextIntlClientProvider } from 'next-intl'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { GlobalEmailConfirmationDetector } from '@/features/auth/components'
import { FloatingDockContainer } from '@/features/floating-dock/components'
import { Footer } from "@/features/footer/components"
import { GlobalShortcutsWrapper } from '@/features/global/components'
import { Header } from "@/features/header/components"
import { NextThemeProvider, SubdomainProvider } from "@/features/layout/components"
import { ChatDoc } from "@/features/layout/components/chat-doc"
import { ChatProvider } from "@/features/layout/components/chat-provider"
import { LayoutType } from '@/features/layout/types'
import { getCurrentUserPermissionsAction } from '@/features/plans/actions/get-current-user-permissions.action'
import { PlanProvider } from '@/features/plans/components/plan-provider'
import { BProgressProvider } from "@/features/shadcn/components/bprogress-provider"
import { CookiePanel } from '@/features/shadcn/components/ui/cookie-banner-1'
import { Toaster } from "@/features/shadcn/components/ui/sonner"

export default async function RootLayout({ children, params }: LayoutType) {

  const { locale } = await params;
  const { payload: user } = await getCurrentUserPermissionsAction();

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GlobalShortcutsWrapper>
        <NuqsAdapter>
          <NextIntlClientProvider locale={locale}>
            <BProgressProvider options={{ showSpinner: true }} startOnLoad spinnerPosition="bottom-right" shallowRouting={false}>
              <ChatProvider>
                <PlanProvider user={user}>
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
                        <GlobalEmailConfirmationDetector />
                        <CookiePanel
                          privacyHref='/privacy-policy'
                          termsHref='/terms-and-conditions'
                        />
                      </>
                    )}
                    userLayout={(
                      <>
                        {children}
                        <ChatDoc />
                        <GlobalEmailConfirmationDetector />
                        <Toaster position="top-center" richColors />
                      </>
                    )}
                  />
                </PlanProvider>
              </ChatProvider>
            </BProgressProvider>
          </NextIntlClientProvider>
        </NuqsAdapter>
      </GlobalShortcutsWrapper>
    </NextThemeProvider>
  )
}
