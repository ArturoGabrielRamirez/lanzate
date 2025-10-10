'use client';

import { ThemeToggle, LanguageSwitch } from '@/features/header/components';
import type { SettingsToolbarProps } from '@/features/header/types';

function SettingsToolbar({ className }: SettingsToolbarProps) {
  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <LanguageSwitch />
      <div className="h-6 w-px bg-border" />
      <ThemeToggle />
    </div>
  );
};

export { SettingsToolbar };


