'use client'

import { Keyboard } from "lucide-react"
import { useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'

import { KeyboardShortcut } from "@/features/global/types"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/shadcn/components/ui/dialog"



const shortcuts: KeyboardShortcut[] = [
  // Atajos globales
  { keys: ['Ctrl', 'K'], description: 'Búsqueda global', category: 'global' },
  { keys: ['Ctrl', 'N'], description: 'Nueva venta', category: 'global' },
  { keys: ['Ctrl', 'B'], description: 'Buscar productos', category: 'global' },
  { keys: ['Ctrl', 'T'], description: 'Tiendas', category: 'global' },
  { keys: ['Ctrl', 'I'], description: 'Inventario', category: 'global' },
  { keys: ['Ctrl', 'H'], description: 'Historial de órdenes', category: 'global' },
  { keys: ['Ctrl', ','], description: 'Configuración', category: 'global' },
  
  // Atajos en venta (teclas simples)
  { keys: ['C'], description: 'Cobrar / Finalizar venta', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['V'], description: 'Calcular vuelto', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['P'], description: 'Imprimir ticket', category: 'sale' },
  { keys: ['L'], description: 'Limpiar carrito', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['R'], description: 'Reembolso', category: 'sale' },
  { keys: ['+'], description: 'Aumentar cantidad último item', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['-'], description: 'Disminuir cantidad último item', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['Esc'], description: 'Limpiar búsqueda', category: 'sale' },
  { keys: ['H'], description: 'Abrir ayuda de atajos', category: 'global' },
]

function KeyboardShortcutsHelp({ isInSale = false }: { isInSale?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  // Atajo para abrir la ayuda: Shift + /
  useHotkeys('h', (e) => {
    e.preventDefault()
    setIsOpen(true)
  }, { enableOnFormTags: false })

  const globalShortcuts = shortcuts.filter(s => s.category === 'global')
  const saleShortcuts = shortcuts.filter(s => s.category === 'sale')

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Keyboard className="size-4" />
        <span className="hidden sm:inline">Atajos</span>
        <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">H</kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="size-5" />
              Atajos de Teclado
            </DialogTitle>
            <DialogDescription>
              Usa estos atajos para trabajar más rápido en Lanzate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Info importante */}
            <Alert>
              <AlertDescription>
                💡 Los atajos con <strong>teclas simples</strong> (C, V, P, etc.) solo funcionan cuando <strong>NO estás escribiendo</strong> en un campo de texto. 
                Esto evita interferencias con tu búsqueda de productos.
              </AlertDescription>
            </Alert>

            {/* Atajos Globales */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                Atajos Globales (funcionan en toda la app)
              </h3>
              <div className="space-y-2">
                {globalShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded min-w-[28px] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atajos en Venta */}
            {isInSale && (
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Atajos en Venta (solo cuando NO estás escribiendo)
                </h3>
                <div className="space-y-2">
                  {saleShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-sm block">{shortcut.description}</span>
                        {shortcut.condition && (
                          <span className="text-xs text-muted-foreground">{shortcut.condition}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded min-w-[28px] text-center"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Presiona <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">H</kbd> para ver esta ayuda en cualquier momento
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Recordá:</strong> Las teclas simples (C, V, P, L, R) solo funcionan cuando el foco NO está en un campo de búsqueda o texto
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { KeyboardShortcutsHelp }