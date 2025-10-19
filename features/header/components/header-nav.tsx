import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';
import { getUserInfo } from '@/features/layout/actions';

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