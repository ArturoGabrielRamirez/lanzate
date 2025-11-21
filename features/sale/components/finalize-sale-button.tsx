"use client"

import { CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import * as Yup from 'yup'

import { ButtonWithPopup } from '@/features/global/components/button-with-popup'
import InputField from '@/features/global/components/form/input'
import { SelectField } from '@/features/global/components/form/select-field'
import type { FinalizeSaleButtonProps, FinalizeSaleFormData } from '@/features/sale/types'
import { Label } from '@/features/shadcn/components/ui/label'
import { Switch } from '@/features/shadcn/components/ui/switch'

const finalizeSaleSchema = Yup.object({
  paymentMethod: Yup.string()
    .oneOf(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO'])
    .required('Debes seleccionar un método de pago'),
  includeCustomerInfo: Yup.boolean(),
  name: Yup.string()
    .when('includeCustomerInfo', {
      is: true,
      then: (schema) => schema
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre del cliente es requerido'),
      otherwise: (schema) => schema.optional()
    }),
  phone: Yup.string()
    .when('includeCustomerInfo', {
      is: true,
      then: (schema) => schema
        .min(8, 'El teléfono debe tener al menos 8 dígitos')
        .required('El teléfono del cliente es requerido'),
      otherwise: (schema) => schema.optional()
    }),
  email: Yup.string()
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
  { value: 'MERCADO_PAGO', label: 'Mercado Pago' }
]

function FinalizeSaleButton({
  cartTotal,
  cartItemCount,
  disabled = false,
  className,
  onConfirm,
  setSelectedPaymentMethod,
  setCustomerInfo,
  branchName
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
    setSelectedPaymentMethod(data.paymentMethod)

    if (data.includeCustomerInfo) {
      setCustomerInfo({
        name: data.name,
        phone: data.phone,
        email: data.email
      })
    } else {
      setCustomerInfo({ name: '', phone: '', email: '' })
    }

    const { error, message, payload } = await onConfirm({
      paymentMethod: data.paymentMethod,
      customerInfo: {
        name: data.name,
        phone: data.phone,
        email: data.email
      }
    })

    return { hasError: error, message, payload }
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
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Sucursal</span>
          <span className="font-medium">{branchName || t('sale')}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Cant. unidades</span>
          <span className="font-medium">{cartItemCount} {cartItemCount === 1 ? t('item') : t('items')}</span>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <SelectField
            name="paymentMethod"
            label="Método de pago"
            options={paymentMethodOptions}
          />
          <div className="flex flex-col gap-2 justify-center items-center">
            <Label htmlFor="include-customer-info" className="text-sm font-medium">
              Información del cliente
            </Label>
            <Switch
              id="include-customer-info"
              name="includeCustomerInfo"
              checked={includeCustomerInfo}
              onCheckedChange={setIncludeCustomerInfo}
            />
          </div>
        </div>


        {includeCustomerInfo && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Información del cliente</h4>

            <InputField
              name="name"
              label="Nombre completo"
              type="text"
              placeholder="Ingrese el nombre del cliente"
            />

            <InputField
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="Ingrese el teléfono del cliente"
            />

            <InputField
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="Ingrese el correo electrónico del cliente"
            />
          </div>
        )}


      </div>
    </ButtonWithPopup>
  )
}

export { FinalizeSaleButton }