'use client'

import { ShortcutHintProps } from "@/features/global/types"
import { Badge } from "@/features/shadcn/components/ui/badge"



function ShortcutHint({ keys, label, variant = "secondary", size = "sm" }: ShortcutHintProps) {
    return (
      <Badge variant={variant} className={`gap-1 font-mono ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {label && <span className="mr-1">{label}</span>}
        {keys.map((key, index) => (
          <span key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-0.5">+</span>}
            <kbd className="px-1 py-0.5 bg-background/50 rounded text-xs font-semibold border border-border/50">
              {key}
            </kbd>
          </span>
        ))}
      </Badge>
    )
  }

// Componente para la barra de estado con shortcuts activos
function ShortcutsStatusBar({ hasCartItems = false }: { hasCartItems?: boolean }) {
  const activeShortcuts = hasCartItems
    ? [
      { keys: ['C'], label: 'Cobrar' },
      { keys: ['V'], label: 'Vuelto' },
      { keys: ['P'], label: 'Imprimir' },
      { keys: ['L'], label: 'Limpiar' },
    ]
    : [
      { keys: ['Ctrl', 'B'], label: 'Buscar' },
      { keys: ['Esc'], label: 'Cancelar' },
      { keys: ['H'], label: 'Ayuda' },
    ]

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 hidden lg:block">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground mr-2">Atajos rápidos:</span>
          {activeShortcuts.map((shortcut, index) => (
            <ShortcutHint
              key={index}
              keys={shortcut.keys}
              label={shortcut.label}
              variant="outline"
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente compacto para mostrar un shortcut inline
function InlineShortcut({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-0.5 ml-2">
      {keys.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          {index > 0 && <span className="mx-0.5 text-muted-foreground">+</span>}
          <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground border border-border/50 rounded">
            {key}
          </kbd>
        </span>
      ))}
    </span>
  )
}

export { ShortcutHint, ShortcutsStatusBar, InlineShortcut }