"use client"

import { CreditCard } from 'lucide-react'
import { ButtonWithPopup } from '@/features/layout/components'
import { useTranslations } from 'next-intl'
import * as Yup from 'yup'
import InputField from '@/features/layout/components/input'
import SelectField from '@/features/settings/components/select-field'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import type { PaymentMethod } from '@/features/dashboard/types/operational-settings'

type CustomerInfo = {
  name: string
  phone: string
  email: string
}

type FinalizeSaleButtonProps = {
  cartTotal: number
  cartItemCount: number
  disabled?: boolean
  className?: string
  onConfirm: (formData: { paymentMethod: PaymentMethod; customerInfo: CustomerInfo }) => Promise<{ error: boolean; payload: FinalizeSaleFormData; message: string }>
  selectedPaymentMethod: PaymentMethod
  setSelectedPaymentMethod: (method: PaymentMethod) => void
  customerInfo: CustomerInfo
  setCustomerInfo: (info: CustomerInfo) => void
}

type FinalizeSaleFormData = {
  paymentMethod: PaymentMethod
  includeCustomerInfo: boolean
  customerName: string
  customerPhone: string
  customerEmail: string
}

const finalizeSaleSchema = Yup.object({
  paymentMethod: Yup.string()
    .oneOf(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO'])
    .required('Debes seleccionar un método de pago'),
  includeCustomerInfo: Yup.boolean(),
  customerName: Yup.string()
    .when('includeCustomerInfo', {
      is: true,
      then: (schema) => schema
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre del cliente es requerido'),
      otherwise: (schema) => schema.optional()
    }),
  customerPhone: Yup.string()
    .when('includeCustomerInfo', {
      is: true,
      then: (schema) => schema
        .min(8, 'El teléfono debe tener al menos 8 dígitos')
        .required('El teléfono del cliente es requerido'),
      otherwise: (schema) => schema.optional()
    }),
  customerEmail: Yup.string()
    .when('includeCustomerInfo', {
      is: true,
      then: (schema) => schema
        .email('El email debe tener un formato válido')
        .required('El email del cliente es requerido'),
      otherwise: (schema) => schema.optional()
    })
})

const paymentMethodOptions = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
  { value: 'DEBIT_CARD', label: 'Tarjeta de Débito' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'CRYPTO', label: 'Criptomonedas' }
]

function FinalizeSaleButton({ 
  cartTotal, 
  cartItemCount, 
  disabled = false, 
  className, 
  onConfirm,
  /* selectedPaymentMethod, */
  setSelectedPaymentMethod,
  /* customerInfo, */
  setCustomerInfo
}: FinalizeSaleButtonProps) {
  const t = useTranslations('sale.finalize-sale')
  const [includeCustomerInfo, setIncludeCustomerInfo] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleFinalizeSale = async (data: FinalizeSaleFormData) => {
    // Update the parent state with the form data
    setSelectedPaymentMethod(data.paymentMethod)
    
    // Only set customer info if the switch was enabled
    if (data.includeCustomerInfo) {
      setCustomerInfo({
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail
      })
    } else {
      setCustomerInfo({ name: '', phone: '', email: '' })
    }

    // Call the parent confirmation function
    await onConfirm({
      paymentMethod: data.paymentMethod,
      customerInfo: data.includeCustomerInfo ? {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail
      } : { name: '', phone: '', email: '' }
    })

    return { error: false, payload: data, message: 'Venta finalizada correctamente' }
  }

  return (
    <ButtonWithPopup<FinalizeSaleFormData>
      text={
        <>
          <CreditCard className="h-5 w-5" />
          <span className='hidden lg:block'>{t('title')}</span>
        </>
      }
      title={t('popup-title')}
      description={t('popup-description', { 
        total: formatPrice(cartTotal),
        items: cartItemCount,
        itemText: cartItemCount === 1 ? t('item') : t('items')
      })}
      action={handleFinalizeSale}
      schema={finalizeSaleSchema}
      disabled={disabled || cartItemCount === 0}
      className={className}
      variant="default"
      messages={{
        success: t('success-message'),
        error: t('error-message'),
        loading: t('loading-message')
      }}
    >
      <div className="space-y-6">
        {/* Resumen de la venta */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('summary-title')}
            </div>
            <div className="text-2xl font-bold">
              {formatPrice(cartTotal)}
            </div>
            <div className="text-xs text-muted-foreground">
              {cartItemCount} {cartItemCount === 1 ? t('item') : t('items')}
            </div>
          </div>
        </div>

        {/* Método de pago */}
        <div className="w-full">
          <SelectField
            name="paymentMethod"
            label="Método de pago"
            options={paymentMethodOptions}
          />
        </div>

        {/* Switch para información del cliente */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="include-customer-info" 
            name="includeCustomerInfo"
            checked={includeCustomerInfo}
            onCheckedChange={setIncludeCustomerInfo}
          />
          <Label htmlFor="include-customer-info" className="text-sm font-medium">
            Incluir información del cliente
          </Label>
        </div>

        {/* Información del cliente - solo visible si el switch está activado */}
        {includeCustomerInfo && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Información del cliente</h4>
            
            <InputField
              name="customerName"
              label="Nombre completo"
              type="text"
              placeholder="Ingrese el nombre del cliente"
            />

            <InputField
              name="customerPhone"
              label="Teléfono"
              type="tel"
              placeholder="Ingrese el teléfono del cliente"
            />

            <InputField
              name="customerEmail"
              label="Email"
              type="email"
              placeholder="Ingrese el email del cliente"
            />
          </div>
        )}

        {/* Información adicional */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('transaction-type')}</span>
            <span className="font-medium">{t('sale')}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('status')}</span>
            <span className="font-medium text-green-600">{t('completed')}</span>
          </div>
        </div>
      </div>
    </ButtonWithPopup>
  )
}

export default FinalizeSaleButton 