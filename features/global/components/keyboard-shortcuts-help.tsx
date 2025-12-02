'use client'

import { Keyboard } from "lucide-react"
import { useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'

import { KeyboardShortcut, KeyboardShortcutsHelpProps } from "@/features/global/types"
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
  { keys: ['H'], description: 'Abrir ayuda de atajos', category: 'global' },
  { keys: ['Esc'], description: 'Cerrar diálogo/Cancelar', category: 'global' },

  // Atajos en venta
  { keys: ['C'], description: 'Cobrar / Finalizar venta', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['V'], description: 'Calcular vuelto', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['P'], description: 'Imprimir ticket', category: 'sale' },
  { keys: ['L'], description: 'Limpiar carrito', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['R'], description: 'Reembolso', category: 'sale' },
  { keys: ['+'], description: 'Aumentar cantidad último item', category: 'sale', condition: 'Con artículos en carrito' },
  { keys: ['-'], description: 'Disminuir cantidad último item', category: 'sale', condition: 'Con artículos en carrito' },

  // Atajos en Account
  { keys: ['E'], description: 'Ir a tab Información Básica', category: 'account', condition: 'Desde cualquier tab' },
  { keys: ['E'], description: 'Editar perfil', category: 'account', condition: 'Dentro del tab' },
  { keys: ['A'], description: 'Cambiar avatar', category: 'account', condition: 'En tab Información Básica' },

  // Atajos en Security
  { keys: ['1'], description: 'Ir a tab Seguridad', category: 'security', condition: 'Desde cualquier tab' },
  { keys: ['1'], description: 'Cambiar email', category: 'security', condition: 'Dentro del tab' },
  { keys: ['2'], description: 'Cambiar contraseña', category: 'security', condition: 'En tab Seguridad' },

  // Atajos en Membership
  { keys: ['U'], description: 'Ir a tab Membresía', category: 'membership', condition: 'Desde cualquier tab' },
  { keys: ['U'], description: 'Actualizar plan', category: 'membership', condition: 'Dentro del tab' },
  { keys: ['C'], description: 'Cancelar suscripción', category: 'membership', condition: 'En tab Membresía' },

  // Atajos en Danger Zone
  { keys: ['D'], description: 'Ir a tab Zona de Peligro', category: 'danger-zone', condition: 'Desde cualquier tab' },
  { keys: ['D'], description: 'Eliminar cuenta', category: 'danger-zone', condition: 'Dentro del tab' },
]


function KeyboardShortcutsHelp({
  isInSale = false,
  isInAccount = false,
  activeAccountTab = 'account'
}: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  useHotkeys('h', (e) => {
    e.preventDefault()
    setIsOpen(true)
  }, { enableOnFormTags: false })

  const globalShortcuts = shortcuts.filter(s => s.category === 'global')
  const saleShortcuts = shortcuts.filter(s => s.category === 'sale')
  const accountShortcuts = shortcuts.filter(s => {
    if (isInAccount) {
      return s.category === activeAccountTab || s.category === 'account'
    }
    return false
  })

  const getContextTitle = () => {
    if (isInSale) return 'en Venta'
    if (isInAccount) {
      switch (activeAccountTab) {
        case 'account': return 'en Información Básica'
        case 'security': return 'en Seguridad'
        case 'membership': return 'en Membresía'
        case 'danger-zone': return 'en Zona de Peligro'
      }
    }
    return ''
  }

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
              Atajos de Teclado {getContextTitle()}
            </DialogTitle>
            <DialogDescription>
              Usá estos atajos para trabajar más rápido en Lanzate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Info importante */}
            {isInSale && (
              <Alert>
                <AlertDescription>
                  💡 Los atajos con <strong>teclas simples</strong> (C, V, P, etc.) solo funcionan cuando <strong>NO estás escribiendo</strong> en un campo de texto.
                </AlertDescription>
              </Alert>
            )}

            {isInAccount && (
              <Alert>
                <AlertDescription>
                  💡 Los atajos de navegación (E, 1, U, D) tienen <strong>doble función</strong>: te llevan al tab correspondiente O ejecutan la acción principal si ya estás en ese tab.
                </AlertDescription>
              </Alert>
            )}

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

            {/* Atajos en Account */}
            {isInAccount && accountShortcuts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Atajos {getContextTitle()}
                </h3>
                <div className="space-y-2">
                  {accountShortcuts.map((shortcut, index) => (
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
              {isInSale && (
                <p className="text-xs text-muted-foreground">
                  <strong>Recordá:</strong> Las teclas simples (C, V, P, L, R) solo funcionan cuando el foco NO está en un campo de búsqueda o texto
                </p>
              )}
              {isInAccount && (
                <p className="text-xs text-muted-foreground">
                  <strong>Navegación:</strong> Los atajos te llevan al tab desde cualquier lugar. Una vez en el tab, ejecutan la acción principal.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { KeyboardShortcutsHelp }