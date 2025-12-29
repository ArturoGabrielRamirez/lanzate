'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { HintMode, KeyboardShortcutsStore } from '@/features/global/types'

export const useKeyboardShortcutsStore = create<KeyboardShortcutsStore>()(
    persist(
        (set, get) => ({
            hintMode: 'hover',

            setHintMode: (mode) => set({ hintMode: mode }),

            toggleHintMode: () => {
                const modes: HintMode[] = ['always', 'hover', 'never']
                const currentIndex = modes.indexOf(get().hintMode)
                const nextIndex = (currentIndex + 1) % modes.length
                set({ hintMode: modes[nextIndex] })
            },
        }),
        {
            name: 'keyboard-shortcuts-storage',
        }
    )
)