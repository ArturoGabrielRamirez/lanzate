'use client'

import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

import { KeyboardShortcutsConfig } from '@/features/global/types'


export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
    const router = useRouter()
    const {
        onNewSale,
        onFinalizeSale,
        onCalculateChange,
        onPrintReceipt,
        onClearCart,
        onRefund,
        onFocusSearch,
        onClearSearch,
        onIncreaseQuantity,
        onDecreaseQuantity,
        isInSale = false,
        hasCartItems = false,
        disabled = false,
    } = config

    // ============ ATAJOS GLOBALES (Ctrl + tecla) ============

    // Ctrl + K - Búsqueda global (manejado por cmdk)
    useHotkeys('mod+k', (e) => {
        if (disabled) return
        e.preventDefault()
    }, { enableOnFormTags: true })

    // Ctrl + B - Búsqueda en venta / productos
    useHotkeys('mod+b', (e) => {
        if (disabled) return
        e.preventDefault()
        if (isInSale && onFocusSearch) {
            onFocusSearch()
        }
    }, { enableOnFormTags: false })

    // Ctrl + N - Nueva venta
    useHotkeys('mod+n', (e) => {
        if (disabled) return
        e.preventDefault()
        if (onNewSale) {
            onNewSale()
        } else {
            router.push('/sale')
        }
    }, { enableOnFormTags: true })

    // Ctrl + T - Tiendas
    useHotkeys('mod+t', (e) => {
        if (disabled) return
        e.preventDefault()
        router.push('/stores')
    }, { enableOnFormTags: true })

    // Ctrl + I - Inventario/Productos
    useHotkeys('mod+i', (e) => {
        if (disabled) return
        e.preventDefault()
        router.push('/products')
    }, { enableOnFormTags: true })

    // Ctrl + H - Historial
    useHotkeys('mod+h', (e) => {
        if (disabled) return
        e.preventDefault()
        router.push('/orders')
    }, { enableOnFormTags: true })

    // Ctrl + , - Configuración
    useHotkeys('mod+,', (e) => {
        if (disabled) return
        e.preventDefault()
        router.push('/account')
    }, { enableOnFormTags: true })

    // ============ ATAJOS EN VENTA (teclas simples - NO se ejecutan en inputs) ============

    // C - Finalizar venta (Cobrar)
    useHotkeys('c', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (hasCartItems && onFinalizeSale) {
            onFinalizeSale()
        }
    }, { enableOnFormTags: false }) // Crítico: NO en inputs

    // V - Calcular vuelto (Vuelto)
    useHotkeys('v', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (hasCartItems && onCalculateChange) {
            onCalculateChange()
        }
    }, { enableOnFormTags: false })

    // P - Imprimir ticket
    useHotkeys('p', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (onPrintReceipt) {
            onPrintReceipt()
        }
    }, { enableOnFormTags: false })

    // L - Limpiar carrito (Limpiar)
    useHotkeys('l', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (hasCartItems && onClearCart) {
            // Confirmación antes de limpiar
            if (window.confirm('¿Limpiar todo el carrito?')) {
                onClearCart()
            }
        }
    }, { enableOnFormTags: false })

    // R - Reembolso
    useHotkeys('r', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (onRefund) {
            onRefund()
        }
    }, { enableOnFormTags: false })

    // Esc - Limpiar búsqueda
    useHotkeys('escape', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (onClearSearch) {
            onClearSearch()
        }
    }, { enableOnFormTags: true }) // SÍ en inputs para poder salir

    // + o = - Aumentar cantidad
    useHotkeys('plus,equal', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (hasCartItems && onIncreaseQuantity) {
            onIncreaseQuantity()
        }
    }, { enableOnFormTags: false })

    // - - Disminuir cantidad
    useHotkeys('minus', (e) => {
        if (disabled || !isInSale) return
        e.preventDefault()
        if (hasCartItems && onDecreaseQuantity) {
            onDecreaseQuantity()
        }
    }, { enableOnFormTags: false })

    // ? - Mostrar ayuda de atajos
    useHotkeys('h', (e) => {
        if (disabled) return
        e.preventDefault()
        // El modal se abre desde el componente KeyboardShortcutsHelp
    }, { enableOnFormTags: false })
}

// Hook para componentes que solo necesitan atajos globales
export function useGlobalKeyboardShortcuts() {
    useKeyboardShortcuts({ isInSale: false })
}