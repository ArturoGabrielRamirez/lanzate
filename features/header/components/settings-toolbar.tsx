'use client';

import { LanguageSwitch } from './language-switch';
import { ThemeToggle } from './theme-toggle';
import type { SettingsToolbarProps } from '../types';

export const SettingsToolbar = ({ className }: SettingsToolbarProps) => {
  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <LanguageSwitch />
      <div className="h-6 w-px bg-border" />
      <ThemeToggle />
    </div>
  );
};


