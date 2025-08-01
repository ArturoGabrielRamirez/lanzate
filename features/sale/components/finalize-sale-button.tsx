"use client"

import { CreditCard } from 'lucide-react'
import { ButtonWithPopup } from '@/features/layout/components'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
/* import * as Yup from 'yup' */

type FinalizeSaleButtonProps = {
  cartTotal: number
  cartItemCount: number
  disabled?: boolean
  className?: string
  onConfirm: () => void
}

type FinalizeSaleFormData = {
  confirmed: boolean
}

/* const finalizeSaleSchema = Yup.object({
  confirmed: Yup.boolean()
    .oneOf([true], 'Debes confirmar la venta para continuar')
    .required('Confirmación requerida')
}) */

function FinalizeSaleButton({ cartTotal, cartItemCount, disabled = false, className, onConfirm }: FinalizeSaleButtonProps) {
  const t = useTranslations('sale.finalize-sale')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleFinalizeSale = async (data: FinalizeSaleFormData) => {
    // Llamar a la función de confirmación pasada como prop
    console.log("finalizar venta")
    onConfirm()
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
      /* schema={finalizeSaleSchema} */
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

        {/* Información adicional */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('payment-method')}</span>
            <span className="font-medium">{t('cash')}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('transaction-type')}</span>
            <span className="font-medium">{t('sale')}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('status')}</span>
            <span className="font-medium text-green-600">{t('completed')}</span>
          </div>
        </div>

        {/* Switch de confirmación */}
        <div className="flex items-center space-x-2">
          <Switch id="confirm-sale" name="confirmed" />
          <Label htmlFor="confirm-sale" className="text-sm font-medium">
            {t('confirmation-message')}
          </Label>
        </div>

        {/* Mensaje informativo */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('info-message')}
            </p>
          </div>
        </div>
      </div>
    </ButtonWithPopup>
  )
}

export default FinalizeSaleButton 