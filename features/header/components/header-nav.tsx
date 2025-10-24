import { getUserInfo } from '@/features/global/actions/get-user-info.action';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';

async function HeaderNav() {

    const { payload: user } = await getUserInfo()

    return (
        <HeaderNavContainer>
            {user ? (
                <HeaderNavAuth />
            ) : (
                <HeaderNavGuest />
            )}
        </HeaderNavContainer>
    )
};

export { HeaderNav };