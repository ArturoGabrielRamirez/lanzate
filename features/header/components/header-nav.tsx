import { getCurrentUserAction } from '@/features/global/actions';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';

async function HeaderNav() {

  const { payload: currentUser } = await getCurrentUserAction();

  return (
    <HeaderNavContainer>
      {currentUser ? (
        <HeaderNavAuth />
      ) : (
        <HeaderNavGuest />
      )}
    </HeaderNavContainer>
  )
};

export { HeaderNav };