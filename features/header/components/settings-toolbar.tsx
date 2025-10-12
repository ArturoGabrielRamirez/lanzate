import { LanguageSwitch } from '@/features/header/components/language-switch';
import { ThemeToggle } from '@/features/header/components/theme-toggle';
import type { SettingsToolbarProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

function SettingsToolbar({ className }: SettingsToolbarProps) {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <LanguageSwitch />
            <div className="h-6 w-px bg-border" />
            <ThemeToggle />
        </div>
    );
};

export { SettingsToolbar };