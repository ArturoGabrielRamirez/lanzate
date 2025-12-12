import { NextIntlClientProvider } from 'next-intl'

/* 
import { GlobalEmailConfirmationDetector } from '@/features/auth/components'
import { SubdomainProvider } from "@/features/layout/components"
import { ChatDoc } from "@/features/layout/components/chat-doc"
import { ChatProvider } from "@/features/layout/components/chat-provider" 
*/
import { LayoutType } from '@/features/layout/types'

export default async function RootLayout({ children, params }: LayoutType) {

  const { locale } = await params;

  return (
    <NextIntlClientProvider locale={locale}>
      {children}
    </NextIntlClientProvider>
  )

  /* return (
          <ChatProvider>
              <SubdomainProvider
                adminLayout={(
                  <>
                    <main className='flex flex-col grow'>
                      {children}
                    </main>
                    <ChatDoc />
                    <GlobalEmailConfirmationDetector />
                  </>
                )}
                userLayout={(
                  <>
                    {children}
                    <ChatDoc />
                    <GlobalEmailConfirmationDetector />
                  </>
                )}
              />
          </ChatProvider>
    ) */
}
