"use client"

import { PaymentMethod } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'

import { CartItemType } from '@/features/cart/types'
import { createNewWalkInOrder } from '@/features/checkout/actions/create-new-walk-in-order.action'
import { searchProductByBarcodeAction } from '@/features/products/actions/search-product-by-barcode.action'
import { ActionsSection, BarcodeScannerUSB, CartSection, ProductResults, SearchSection } from '@/features/sale/components'
import type { ScannedProduct, ProductSearchResult, CartItem, ProductSearchByNameResult, SaleInterfaceProps, CustomerInfo, SearchSectionRef } from '@/features/sale/types'
import { actionWrapper } from '@/utils/lib'

function SaleInterface({ storeId, branchId, subdomain, processed_by_user_id, branchName }: SaleInterfaceProps) {
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

  // New state for payment method and customer info
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CASH')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  })

  const searchSectionRef = useRef<SearchSectionRef>(null)
  const t = useTranslations('sale.messages')

  const handleProductScanned = async (barcode: string) => {
    setSearchResults({
      products: [],
      message: '',
      isLoading: false,
      error: false
    })

    setBarcodeResult({
      product: null,
      message: t('searching-product'),
      isLoading: true,
      error: false
    })

    try {
      const { error, payload, message } = await searchProductByBarcodeAction(barcode, storeId)

      if (error || !payload) {
        setBarcodeResult({
          product: null,
          message: message || t('product-not-found'),
          isLoading: false,
          error: true
        })
      } else {
        setBarcodeResult({
          product: payload,
          message: t('product-found'),
          isLoading: false,
          error: false
        })

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

    if (results.products.length > 0 || results.isLoading) {
      setBarcodeResult({
        product: null,
        message: '',
        isLoading: false,
        error: false
      })
    }
  }

  const handleClearResults = () => {
    setSearchResults({
      products: [],
      message: '',
      isLoading: false,
      error: false
    })

    setBarcodeResult({
      product: null,
      message: '',
      isLoading: false,
      error: false
    })

    searchSectionRef.current?.clearSearch()
  }

  const handleAddToCart = (product: ScannedProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)

      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
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

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleFinalizeSale = async (formData: { paymentMethod: PaymentMethod; customerInfo: CustomerInfo }) => {
    return actionWrapper(async () => {

      const { error, message, payload } = await createNewWalkInOrder({
        branch_id: branchId,
        subdomain: subdomain,
        cart: cartItems.map(item => ({
          quantity: item.quantity,
          id: item.product.id.toString(),
          price: item.product.price
        } as CartItemType)),
        total_price: cartTotal,
        total_quantity: cartItemCount,
        isPaid: true,
        payment_method: formData.paymentMethod,
        processed_by_user_id: processed_by_user_id,
        customer_info: {
          name: formData.customerInfo.name,
          phone: formData.customerInfo.phone,
          email: formData.customerInfo.email,
        },
      })

      if (error) {
        throw new Error(message)
      }

      setCartItems([])
      setCustomerInfo({ name: '', phone: '', email: '' })
      setSelectedPaymentMethod('CASH')
      setSearchResults({
        products: [],
        message: '',
        isLoading: false,
        error: false
      })


      return {
        error: false,
        message: "Order created successfully",
        payload: payload
      }
    })
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
    <div className="grid grid-cols-1 lg:grid-areas-[search_barcode_cart,results_results_cart,buttons_buttons_cart] gap-6 flex-1 lg:grid-cols-[1fr_1fr_350px] xl:grid-cols-[1fr_1fr_450px] grid-rows-[min-content_min-content_1fr_auto] lg:grid-rows-[min-content_1fr_auto]">

      <div className='grid grid-cols-[1fr_auto] gap-4 lg:col-span-2 lg:grid-cols-2'>
        <SearchSection
          storeId={storeId}
          onAddToCart={handleAddToCart}
          onSearchResults={handleSearchResults}
          ref={searchSectionRef}
        />



        <BarcodeScannerUSB onProductScanned={handleProductScanned} />
      </div>

      <ProductResults
        searchResults={searchResults}
        barcodeResult={barcodeResult}
        onAddToCart={handleAddToCart}
        onClearResults={handleClearResults}
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
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        branchName={branchName}
      />

    </div>
  )
}

export default SaleInterface 