import { Home, PlayCircle, HelpCircle, Info, Phone, LogIn, UserPlus, KeyRound } from 'lucide-react';

import type { ReactElement } from 'react';

/**
 * Icon size configuration for navigation items
 */
const ICON_SIZE = 'mr-2 h-4 w-4';

/**
 * Maps href patterns to their corresponding icons
 * Used for navigation menu items
 */
const ICON_MAP: Record<string, ReactElement> = {
  '/': <Home className={ICON_SIZE} aria-hidden />,
  '/#inicio': <Home className={ICON_SIZE} aria-hidden />,
  '/login': <LogIn className={ICON_SIZE} aria-hidden />,
  '/signup': <UserPlus className={ICON_SIZE} aria-hidden />,
  '/forgot-password': <KeyRound className={ICON_SIZE} aria-hidden />,
  '/about': <Info className={ICON_SIZE} aria-hidden />,
  '/contact': <Phone className={ICON_SIZE} aria-hidden />,
};

/**
 * Icon pattern matchers for partial href matching
 */
const ICON_PATTERNS = [
  { pattern: 'how-it-works', icon: <PlayCircle className={ICON_SIZE} aria-hidden /> },
  { pattern: 'pricing', icon: <HelpCircle className={ICON_SIZE} aria-hidden /> },
  { pattern: 'faq', icon: <HelpCircle className={ICON_SIZE} aria-hidden /> },
];

/**
 * Gets the appropriate icon for a given href
 * @param href - The URL path to match
 * @returns The corresponding React icon element or null if no match
 */
export const getIconForHref = (href?: string): ReactElement | null => {
  if (!href) return null;

  // Check exact matches first
  if (ICON_MAP[href]) {
    return ICON_MAP[href];
  }

  // Check for partial matches using patterns
  for (const { pattern, icon } of ICON_PATTERNS) {
    if (href.includes(pattern)) {
      return icon;
    }
  }

  // Check if href starts with a known path
  if (href.startsWith('/#inicio')) {
    return ICON_MAP['/#inicio'];
  }

  return null;
};

