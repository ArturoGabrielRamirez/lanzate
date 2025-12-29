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
        onChangeEmail,
        onChangePassword,
        onUpgradePlan,
        onCancelSubscription,
        onDeleteAccount,

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

    // ============ ATAJOS EN ACCOUNT (LÓGICA MEJORADA) ============

    // E - Navegar a Account O Editar perfil
    useHotkeys('e', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()

        if (activeAccountTab === 'account') {
            // Ya estamos en account, ejecutar acción
            if (onEditProfile) {
                onEditProfile()
            }
        } else {
            // Navegar al tab account
            if (onNavigateToAccount) {
                onNavigateToAccount()
            }
        }
    }, { enableOnFormTags: false })

    // A - Cambiar avatar (solo en tab account)
    useHotkeys('a', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'account') return
        e.preventDefault()
        if (onChangeAvatar) {
            onChangeAvatar()
        }
    }, { enableOnFormTags: false })

    // 1 - Navegar a Security O Cambiar email
    useHotkeys('1', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()

        if (activeAccountTab === 'security') {
            // Ya estamos en security, ejecutar acción
            if (onChangeEmail) {
                onChangeEmail()
            }
        } else {
            // Navegar al tab security
            if (onNavigateToSecurity) {
                onNavigateToSecurity()
            }
        }
    }, { enableOnFormTags: false })

    // 2 - Cambiar contraseña (solo en tab security)
    useHotkeys('2', (e) => {
        if (disabled || !isInAccount || activeAccountTab !== 'security') return
        e.preventDefault()
        if (onChangePassword) {
            onChangePassword()
        }
    }, { enableOnFormTags: false })

    // U - Navegar a Membership O Actualizar plan
    useHotkeys('u', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()

        if (activeAccountTab === 'membership') {
            // Ya estamos en membership, ejecutar acción
            if (onUpgradePlan) {
                onUpgradePlan()
            }
        } else {
            // Navegar al tab membership
            if (onNavigateToMembership) {
                onNavigateToMembership()
            }
        }
    }, { enableOnFormTags: false })

    // C - Finalizar venta O Cancelar suscripción
    useHotkeys('c', (e) => {
        if (disabled) return

        // Prioridad 1: Sale
        if (isInSale && hasCartItems) {
            e.preventDefault()
            if (onFinalizeSale) {
                onFinalizeSale()
            }
            return
        }

        // Prioridad 2: Account membership
        if (isInAccount && activeAccountTab === 'membership') {
            e.preventDefault()
            if (onCancelSubscription) {
                onCancelSubscription()
            }
        }
    }, { enableOnFormTags: false })

    // D - Navegar a Danger Zone O Eliminar cuenta
    useHotkeys('d', (e) => {
        if (disabled || !isInAccount) return
        e.preventDefault()

        if (activeAccountTab === 'danger-zone') {
            // Ya estamos en danger-zone, ejecutar acción
            if (onDeleteAccount) {
                onDeleteAccount()
            }
        } else {
            // Navegar al tab danger-zone
            if (onNavigateToDangerZone) {
                onNavigateToDangerZone()
            }
        }
    }, { enableOnFormTags: false })
}

// Hook para componentes que solo necesitan atajos globales
export function useGlobalKeyboardShortcuts() {
    useKeyboardShortcuts({ isInSale: false, isInAccount: false })
}