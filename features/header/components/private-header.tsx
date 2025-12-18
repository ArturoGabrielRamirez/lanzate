import { BaseHeader } from '@/features/header/components/base-header';
import { BrandLogo } from '@/features/header/components/brand-logo';
import { HeaderActions } from '@/features/header/components/header-actions';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { MobileDrawer } from '@/features/header/components/mobile-drawer';
import { NAV_MENU_ITEMS_AUTH, DRAWER_MENU_ITEMS_GUEST } from '@/features/header/constants';
import type { PrivateHeaderProps } from '@/features/header/types';

function PrivateHeader({ className, user, storesCount }: PrivateHeaderProps) {
    return (
        <BaseHeader className={className}>
            <BrandLogo />
            <HeaderNavContainer>
                <HeaderNavAuth storesCount={storesCount} />
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
