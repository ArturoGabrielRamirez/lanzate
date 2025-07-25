"use client"

import { useState } from 'react'
import { searchProductByBarcode } from '../actions/search-product-by-barcode'
import type { ScannedProduct, ProductSearchResult, CartItem } from '../types'
import CartSection from './cart-section'
import SearchSection from './search-section'
import ActionsSection from './actions-section'
import ProductsSection from './products-section'
import OrdersSection from './orders-section'

type SaleInterfaceProps = {
  storeName: string
  storeDescription?: string
  storeId: number
}

function SaleInterface({ storeName, storeDescription, storeId }: SaleInterfaceProps) {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchResult, setSearchResult] = useState<ProductSearchResult>({
    product: null,
    message: '',
    isLoading: false,
    error: false
  })

  const handleProductScanned = async (barcode: string) => {
    console.log('Producto escaneado:', barcode)

    // Establecer estado de carga
    setSearchResult({
      product: null,
      message: 'Buscando producto...',
      isLoading: true,
      error: false
    })

    try {
      // Buscar producto por código de barras
      const { error, payload, message } = await searchProductByBarcode(barcode, storeId)

      if (error || !payload) {
        setSearchResult({
          product: null,
          message: message || 'Producto no encontrado',
          isLoading: false,
          error: true
        })
      } else {
        // Producto encontrado
        setSearchResult({
          product: payload,
          message: 'Producto encontrado',
          isLoading: false,
          error: false
        })

        // Agregar a la lista de productos escaneados
        setScannedProducts(prev => [payload, ...prev])
      }
    } catch (error) {
      console.error('Error buscando producto:', error)
      setSearchResult({
        product: null,
        message: 'Error al buscar el producto',
        isLoading: false,
        error: true
      })
    }
  }

  const handleAddToCart = (product: ScannedProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)

      if (existingItem) {
        // Si el producto ya está en el carrito, aumentar cantidad
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Si es un producto nuevo, agregarlo al carrito
        return [...prev, {
          product,
          quantity: 1,
          addedAt: new Date()
        }]
      }
    })
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  // Calcular totales del carrito
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Handlers para acciones
  const handleFinalizeSale = () => {
    // TODO: Implementar lógica de finalizar venta
    console.log('Finalizando venta:', { cartItems, total: cartTotal })
    alert(`Venta finalizada. Total: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cartTotal)}`)
    // Limpiar carrito después de la venta
    setCartItems([])
  }

  const handleRefund = () => {
    // TODO: Implementar lógica de reembolso
    console.log('Procesando reembolso')
    alert('Función de reembolso no implementada aún')
  }

  const handleCalculateChange = () => {
    // TODO: Implementar calculadora de vuelto
    console.log('Calculando vuelto para total:', cartTotal)
    const payment = prompt(`Total a cobrar: $${cartTotal.toFixed(2)}\n¿Cuánto pagó el cliente?`)
    if (payment) {
      const change = parseFloat(payment) - cartTotal
      if (change >= 0) {
        alert(`Vuelto: $${change.toFixed(2)}`)
      } else {
        alert('El pago es insuficiente')
      }
    }
  }

  const handlePrintReceipt = () => {
    // TODO: Implementar impresión de ticket
    console.log('Imprimiendo ticket')
    alert('Función de impresión no implementada aún')
  }

  const handleViewOrderHistory = () => {
    // TODO: Implementar vista de historial de órdenes
    console.log('Viendo historial de órdenes')
    alert('Vista de historial no implementada aún')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-areas-[search_cart,products_cart,products_cart,buttons_cart] gap-6 flex-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_450px] lg:grid-rows-[min-content_1fr_min-content]">

      <CartSection
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ActionsSection
          cartTotal={cartTotal}
          cartItemCount={cartItemCount}
          onFinalizeSale={handleFinalizeSale}
          onRefund={handleRefund}
          onClearCart={handleClearCart}
          onCalculateChange={handleCalculateChange}
          onPrintReceipt={handlePrintReceipt}
        />

      <SearchSection
        storeId={storeId}
        onAddToCart={handleAddToCart}
      />

      {/* <ProductsSection
          storeName={storeName}
          scannedProducts={scannedProducts}
          searchResult={searchResult}
          onProductScanned={handleProductScanned}
          onAddToCart={handleAddToCart}
        /> */}

      {/* <OrdersSection
        onViewOrderHistory={handleViewOrderHistory}
      /> */}

    </div>
  )
}

export default SaleInterface 