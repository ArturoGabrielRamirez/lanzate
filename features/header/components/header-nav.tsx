import { getCurrentUserAction } from '@/features/global/actions';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';
import { HeaderNavContainer } from '@/features/header/components/header-nav-container';

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