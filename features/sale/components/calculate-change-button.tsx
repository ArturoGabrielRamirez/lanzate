"use client"

import { Calculator } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import * as Yup from 'yup'

import { InlineShortcut } from '@/features/global/components'
import { ButtonWithPopup } from '@/features/global/components/button-with-popup'
import InputField from '@/features/global/components/form/input'
import type { CalculateChangeButtonProps, ChangeFormData } from '@/features/sale/types'

const changeSchema = Yup.object({
  paymentAmount: Yup.string()
    .required('El monto de pago es requerido')
    .matches(/^\d+(\.\d{1,2})?$/, 'Solo se permiten números con máximo 2 decimales')
    .test('min-amount', 'El monto debe ser mayor al total', function (value) {
      const cartTotal = this.options.context?.cartTotal || 0
      const paymentAmount = parseFloat(value || '0')
      return paymentAmount >= cartTotal
    })
})

const presetAmounts = [500, 1000, 10000, 20000]

function CalculateChangeButton({ cartTotal, disabled = false, className }: CalculateChangeButtonProps) {
  const t = useTranslations('sale.calculate-change')
  const [changeAmount, setChangeAmount] = useState<number | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handlePaymentChange = (value: string) => {
    setPaymentAmount(value)
    const payment = parseFloat(value || '0')
    if (payment >= cartTotal) {
      setChangeAmount(payment - cartTotal)
    } else {
      setChangeAmount(null)
    }
  }

  const handlePresetClick = (amount: number) => {
    const amountStr = amount.toString()
    setPaymentAmount(amountStr)
    setChangeAmount(amount - cartTotal)
  }

  const handleCalculateChange = async (data: ChangeFormData) => {
    return { hasError: false, payload: data, message: 'Cambio calculado correctamente' }
  }

  return (
    <ButtonWithPopup<ChangeFormData>
      data-action="calculate-change"
      text={
        <>
          <Calculator className="h-4 w-4" />
          <span className='hidden lg:flex items-center gap-1'>
            {t('title')}
            <InlineShortcut keys={['V']} />
          </span>
        </>
      }
      title={t('popup-title')}
      description={t('popup-description', { total: formatPrice(cartTotal) })}
      action={handleCalculateChange}
      schema={changeSchema}
      disabled={disabled || cartTotal === 0}
      className={className}
      messages={{
        success: t('success-message'),
        error: t('error-message'),
        loading: t('loading-message')
      }}
      onComplete={() => {
        setPaymentAmount('')
        setChangeAmount(null)
      }}
    >
      <div className="space-y-4">
        <InputField
          name="paymentAmount"
          label={t('payment-amount-label')}
          type="number"
          placeholder={t('payment-amount-placeholder')}
          value={paymentAmount}
          onChange={(e) => handlePaymentChange(e.target.value)}
          startContent="$"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t('preset-amounts-label')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
        </div>

        {changeAmount !== null && changeAmount >= 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('change-amount-label')}
              </span>
              <span className="text-lg font-bold text-green-700 dark:text-green-300">
                {formatPrice(changeAmount)}
              </span>
            </div>
          </div>
        )}

        {changeAmount !== null && changeAmount < 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('insufficient-amount-label')}
              </span>
              <span className="text-lg font-bold text-red-700 dark:text-red-300">
                {formatPrice(Math.abs(changeAmount))}
              </span>
            </div>
          </div>
        )}
      </div>
    </ButtonWithPopup>
  )
}

export { CalculateChangeButton }