import { HeaderLoginLink } from '@/features/header/components/header-login-link';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import type { HeaderActionsProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

function HeaderActions({ showLogin = false, className }: HeaderActionsProps) {
    return (
        <div className={cn("hidden md:flex items-center md:gap-3", className)}>
            <SettingsToolbar />
            {showLogin && <HeaderLoginLink />}
        </div>
    );
}

export { HeaderActions };