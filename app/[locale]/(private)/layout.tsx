import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { FloatingDockContainer } from '@/features/floating-dock/components';
import { GlobalShortcutsWrapper } from "@/features/global/components";
import { PrivateHeader } from '@/features/header/components';
import { getCurrentUserPermissionsAction } from '@/features/plans/actions';
import { PlanProvider } from '@/features/plans/components/plan-provider'
import { CookiePanel } from '@/features/shadcn/components/ui/cookie-banner-1';
import { Toaster } from "@/features/shadcn/components/ui/sonner"

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {

    const { payload: user } = await getCurrentUserPermissionsAction();

    return (
        <GlobalShortcutsWrapper>
            <NuqsAdapter>
                <PlanProvider user={user}>
                    <PrivateHeader />
                    <main className='flex flex-col grow'>
                        {children}
                    </main>
                    <FloatingDockContainer />
                    <Toaster position="top-center" richColors />
                    <CookiePanel
                        privacyHref='/privacy-policy'
                        termsHref='/terms-and-conditions'
                    />
                </PlanProvider>
            </NuqsAdapter>
        </GlobalShortcutsWrapper>
    )
}