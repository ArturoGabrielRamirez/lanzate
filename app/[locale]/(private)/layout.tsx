import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { getDashboardStoresAction } from '@/features/dashboard/actions';
import { FloatingDockContainer } from '@/features/floating-dock/components';
import { GlobalShortcutsWrapper } from "@/features/global/components";
import { PrivateHeader } from '@/features/header/components';
import { getCurrentUserPermissionsAction } from '@/features/plans/actions';
import { PlanProvider } from '@/features/plans/components/plan-provider'
import { CookiePanel } from '@/features/shadcn/components/ui/cookie-banner-1';
import { Toaster } from "@/features/shadcn/components/ui/sonner"

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {

    const { payload: user } = await getCurrentUserPermissionsAction();
    const { payload: dashboardData } = await getDashboardStoresAction(user?.id ?? 0, 2);
    const storesCount = dashboardData?.storeCount ?? 0;

    return (
        <GlobalShortcutsWrapper>
            <NuqsAdapter>
                <PlanProvider user={user}>
                    <PrivateHeader user={user} storesCount={storesCount} />
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