import { getDashboardStoresAction } from '@/features/dashboard/actions';
import { getUserInfo } from '@/features/global/actions/get-user-info.action';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';

async function HeaderNav() {

    const { payload: user } = await getUserInfo()

    const { payload: dashboardData } = await getDashboardStoresAction(user.id, 2)

    return (
        <HeaderNavContainer>
            {user ? (
                <HeaderNavAuth storesCount={dashboardData?.storeCount || 0}/>
            ) : (
                <HeaderNavGuest />
            )}
        </HeaderNavContainer>
    )
};

export { HeaderNav };