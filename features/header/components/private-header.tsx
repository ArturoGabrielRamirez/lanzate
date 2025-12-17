import { getUserInfo } from '@/features/global/actions/get-user-info.action';
import { getDashboardStoresAction } from '@/features/dashboard/actions';
import { BaseHeader } from '@/features/header/components/base-header';
import { BrandLogo } from '@/features/header/components/brand-logo';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';
import { HeaderActions } from '@/features/header/components/header-actions';
import { MobileDrawer } from '@/features/header/components/mobile-drawer';
import { NAV_MENU_ITEMS_AUTH, DRAWER_MENU_ITEMS_GUEST } from '@/features/header/constants';
import type { PrivateHeaderProps } from '@/features/header/types';

async function PrivateHeader({ className }: PrivateHeaderProps) {

    const { payload: user } = await getUserInfo();
    const { payload: dashboardData } = await getDashboardStoresAction(user?.id || 0, 2);
    const storesCount = dashboardData?.storeCount || 0;

    return (
        <BaseHeader className={className}>
            <BrandLogo />
            <HeaderNavContainer>
                {user ? (
                    <HeaderNavAuth storesCount={storesCount} />
                ) : (
                    <HeaderNavGuest />
                )}
            </HeaderNavContainer>
            <div className='flex items-center'>
                <HeaderActions showLogin={!user} />
                <MobileDrawer
                    user={user}
                    menuItems={user ? NAV_MENU_ITEMS_AUTH : DRAWER_MENU_ITEMS_GUEST}
                />
            </div>
        </BaseHeader>
    );
}

export { PrivateHeader };
