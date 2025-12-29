'use client'

import { useGlobalKeyboardShortcuts } from '@/features/global/hooks/use-keyboard-shortcuts'

export function GlobalShortcutsWrapper({ children }: { children: React.ReactNode }) {
  
  useGlobalKeyboardShortcuts()
  
  return children

}