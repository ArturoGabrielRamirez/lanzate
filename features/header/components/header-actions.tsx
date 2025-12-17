import { HeaderLoginLink } from '@/features/header/components/header-login-link';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import type { HeaderActionsProps } from '@/features/header/types';

function HeaderActions({ showLogin = false }: HeaderActionsProps) {
    return (
        <div className="hidden md:flex items-center md:gap-3">
            <SettingsToolbar />
            {showLogin && <HeaderLoginLink />}
        </div>
    );
}

export { HeaderActions };