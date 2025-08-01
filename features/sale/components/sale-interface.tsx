"use client"

import { useState } from 'react'
import { searchProductByBarcode } from '../actions/search-product-by-barcode'
import type { ScannedProduct, ProductSearchResult, CartItem, ProductSearchByNameResult } from '../types'
import CartSection from './cart-section'
import SearchSection from './search-section'
import ActionsSection from './actions-section'
import ProductResults from './product-results'
import BarcodeScannerUSB from './barcode-scanner-usb'
import { useTranslations } from 'next-intl'

type SaleInterfaceProps = {
  storeName: string
  storeDescription?: string
  storeId: number
}

function SaleInterface({ storeId }: SaleInterfaceProps) {
  /* const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]) */
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [barcodeResult, setBarcodeResult] = useState<ProductSearchResult>({
    product: null,
    message: '',
    isLoading: false,
    error: false
  })
  const [searchResults, setSearchResults] = useState<ProductSearchByNameResult>({
    products: [],
    message: '',
    isLoading: false,
    error: false
  })

  const t = useTranslations('sale.messages')

  const handleProductScanned = async (barcode: string) => {
    console.log('Producto escaneado:', barcode)

    // Limpiar resultados de búsqueda por texto cuando se escanea algo
    setSearchResults({
      products: [],
      message: '',
      isLoading: false,
      error: false
    })

    // Establecer estado de carga
    setBarcodeResult({
      product: null,
      message: t('searching-product'),
      isLoading: true,
      error: false
    })

    try {
      // Buscar producto por código de barras
      const { error, payload, message } = await searchProductByBarcode(barcode, storeId)

      if (error || !payload) {
        setBarcodeResult({
          product: null,
          message: message || t('product-not-found'),
          isLoading: false,
          error: true
        })
      } else {
        // Producto encontrado
        setBarcodeResult({
          product: payload,
          message: t('product-found'),
          isLoading: false,
          error: false
        })

        // Agregar a la lista de productos escaneados
        /* setScannedProducts(prev => [payload, ...prev]) */
      }
    } catch (error) {
      console.error('Error buscando producto:', error)
      setBarcodeResult({
        product: null,
        message: t('search-error'),
        isLoading: false,
        error: true
      })
    }
  }

  const handleSearchResults = (results: ProductSearchByNameResult) => {
    setSearchResults(results)

    // Limpiar resultados de código de barras cuando se busca por texto
    if (results.products.length > 0 || results.isLoading) {
      setBarcodeResult({
        product: null,
        message: '',
        isLoading: false,
        error: false
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
    const formattedTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cartTotal)
    alert(t('sale-completed', { total: formattedTotal }))
    // Limpiar carrito después de la venta
    setCartItems([])
  }

  const handleRefund = () => {
    // TODO: Implementar lógica de reembolso
    console.log('Procesando reembolso')
    alert(t('refund-not-implemented'))
  }

  const handleCalculateChange = () => {
    // TODO: Implementar calculadora de vuelto
    console.log('Calculando vuelto para total:', cartTotal)
    const payment = prompt(t('change-calculation', { total: cartTotal.toFixed(2) }))
    if (payment) {
      const change = parseFloat(payment) - cartTotal
      if (change >= 0) {
        alert(t('change-result', { change: change.toFixed(2) }))
      } else {
        alert(t('insufficient-payment'))
      }
    }
  }

  const handlePrintReceipt = () => {
    // TODO: Implementar impresión de ticket
    console.log('Imprimiendo ticket')
    alert(t('print-not-implemented'))
  }

  /* const handleViewOrderHistory = () => {
    // TODO: Implementar vista de historial de órdenes
    console.log('Viendo historial de órdenes')
    alert('Vista de historial no implementada aún')
  } */

  return (
    <div className="grid grid-cols-1 lg:grid-areas-[search_barcode_cart,results_results_cart,buttons_buttons_cart] gap-6 flex-1 lg:grid-cols-[1fr_1fr_350px] xl:grid-cols-[1fr_1fr_450px] lg:grid-rows-[min-content_1fr_min-content]">
      
      <div className='grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2'>
        <SearchSection
          storeId={storeId}
          onAddToCart={handleAddToCart}
          onSearchResults={handleSearchResults}
        />

        <BarcodeScannerUSB onProductScanned={handleProductScanned} />
      </div>

      <ProductResults
        searchResults={searchResults}
        barcodeResult={barcodeResult}
        onAddToCart={handleAddToCart}
      />
      
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

    </div>
  )
}

export default SaleInterface 