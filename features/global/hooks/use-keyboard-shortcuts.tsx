'use client'

import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

import { KeyboardShortcutsConfig } from '@/features/global/types'

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
    const router = useRouter()

    const {
        // Sale callbacks
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

        // Account callbacks
        onEditProfile,
        onChangeAvatar,
        onChangeBanner,
        onChangeEmail,
        onChangePassword,
        onUpgradePlan,
        onCancelSubscription,
        onDeleteAccount,
        onNavigateToStores,

        // Navigation callbacks
        onNavigateToAccount,
        onNavigateToSecurity,
        onNavigateToMembership,
        onNavigateToDangerZone,

        // Context control
        isInSale = false,
        hasCartItems = false,
        isInAccount = false,
        activeAccountTab = 'account',
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
    }, { enableOnFormTags: true })

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

    // H - Mostrar ayuda de atajos
    useHotkeys('h', (e) => {
        if (disabled) return
        e.preventDefault()
        // El modal se abre desde el componente KeyboardShortcutsHelp
    }, { enableOnFormTags: false })

    // ============ ATAJOS EN ACCOUNT - NAVEGACIÓN (Números 1-4) ============

    // 1 - Navegar a Info Básica
    useHotkeys('1', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()
        if (onNavigateToAccount) onNavigateToAccount()
    }, { enableOnFormTags: false })

    // 2 - Navegar a Seguridad
    useHotkeys('2', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()
        if (onNavigateToSecurity) onNavigateToSecurity()
    }, { enableOnFormTags: false })

    // 3 - Navegar a Membresía
    useHotkeys('3', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()
        if (onNavigateToMembership) onNavigateToMembership()
    }, { enableOnFormTags: false })

    // 4 - Navegar a Zona Peligro
    useHotkeys('4', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()
        if (onNavigateToDangerZone) onNavigateToDangerZone()
    }, { enableOnFormTags: false })

    // T - Ir a Tiendas
    useHotkeys('t', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()
        if (onNavigateToStores) {
            onNavigateToStores()
        } else {
            router.push('/stores')
        }
    }, { enableOnFormTags: false })

    // ============ ATAJOS EN ACCOUNT - ACCIONES (Letras mnemónicas) ============

    // E - Editar perfil (solo en tab account)
    useHotkeys('e', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'account') return
        e.preventDefault()
        if (onEditProfile) onEditProfile()
    }, { enableOnFormTags: false })

    // A - Cambiar Avatar (solo en tab account)
    useHotkeys('a', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'account') return
        e.preventDefault()
        if (onChangeAvatar) onChangeAvatar()
    }, { enableOnFormTags: false })

    // B - Cambiar Banner (solo en tab account)
    useHotkeys('b', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'account') return
        e.preventDefault()
        if (onChangeBanner) onChangeBanner()
    }, { enableOnFormTags: false })

    // M - Cambiar eMail (solo en tab security)
    useHotkeys('m', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'security') return
        e.preventDefault()
        if (onChangeEmail) onChangeEmail()
    }, { enableOnFormTags: false })

    // P - Cambiar Password (solo en tab security)
    useHotkeys('p', (e) => {
        // En Sale, P es para imprimir - tiene prioridad
        if (disabled || isInSale) return
        if (!isInAccount || activeAccountTab !== 'security') return
        e.preventDefault()
        if (onChangePassword) onChangePassword()
    }, { enableOnFormTags: false })

    // U - Upgrade plan (solo en tab membership)
    useHotkeys('u', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'membership') return
        e.preventDefault()
        if (onUpgradePlan) onUpgradePlan()
    }, { enableOnFormTags: false })

    // X - Cancelar suscripción (solo en tab membership)
    useHotkeys('x', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'membership') return
        e.preventDefault()
        if (onCancelSubscription) onCancelSubscription()
    }, { enableOnFormTags: false })

    // D - Eliminar cuenta (solo en tab danger-zone)
    useHotkeys('d', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'danger-zone') return
        e.preventDefault()
        if (onDeleteAccount) onDeleteAccount()
    }, { enableOnFormTags: false })

    // C - Finalizar venta (solo en Sale, ya no hay conflicto con Account)
    useHotkeys('c', (e) => {
        if (disabled || !isInSale || !hasCartItems) return
        e.preventDefault()
        if (onFinalizeSale) onFinalizeSale()
    }, { enableOnFormTags: false })
}

// Hook para componentes que solo necesitan atajos globales
export function useGlobalKeyboardShortcuts() {
    useKeyboardShortcuts({ isInSale: false, isInAccount: false })
}