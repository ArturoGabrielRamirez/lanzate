"use client"

import { CreditCard, RotateCcw, Trash2, Calculator, Receipt } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type ActionsSectionProps = {
  cartTotal: number
  cartItemCount: number
  onFinalizeSale: () => void
  onRefund: () => void
  onClearCart: () => void
  onCalculateChange: () => void
  onPrintReceipt: () => void
  disabled?: boolean
}

function ActionsSection({
  /* cartTotal, */
  cartItemCount,
  onFinalizeSale,
  onRefund,
  onClearCart,
  onCalculateChange,
  onPrintReceipt,
  disabled = false
}: ActionsSectionProps) {
  const t = useTranslations('sale.actions')

  /* const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }
 */
  return (
    <Card className='lg:area-[buttons] h-fit'>
      {/* <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings />
          Acciones
        </CardTitle>
      </CardHeader> */}
      <CardContent className='flex lg:grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2 flex-wrap justify-center lg:justify-start'>
        {/* <div className="space-y-4"> */}
        {/* Resumen rápido */}
        {/* <div className="p-3 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total a cobrar</div>
              <div className="text-lg font-bold">{formatPrice(cartTotal)}</div>
              <div className="text-xs text-muted-foreground">{cartItemCount} productos</div>
            </div>
          </div> */}

        {/* Botones principales */}
        <Button
          onClick={onFinalizeSale}
          disabled={disabled || cartItemCount === 0}
          className="lg:w-full text-base"
          variant="default"
        >
          <CreditCard className="h-5 w-5" />
          <span className='hidden lg:block'>{t('finalize-sale')}</span>
        </Button>

        <Button
          onClick={onCalculateChange}
          disabled={disabled || cartItemCount === 0}
          className="lg:w-full"
          variant="outline"
        >
          <Calculator className="h-4 w-4" />
          <span className='hidden lg:block'>{t('calculate-change')}</span>
        </Button>

        <Button
          onClick={onPrintReceipt}
          disabled={disabled}
          className="lg:w-full"
          variant="outline"
        >
          <Receipt className="h-4 w-4" />
          <span className='hidden lg:block'>{t('print-receipt')}</span>
        </Button>

        <Button
          onClick={onRefund}
          disabled={disabled}
          className="lg:w-full"
          variant="outline"
        >
          <RotateCcw className="h-4 w-4" />
          <span className='hidden lg:block'>{t('process-refund')}</span>
        </Button>

        {/* Botones de utilidad */}
        <Button
          onClick={onClearCart}
          disabled={disabled || cartItemCount === 0}
          className="lg:w-full"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className='hidden lg:block'>{t('clear-cart')}</span>
        </Button>

        {/* Información adicional */}
        {/* <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>Métodos: Efectivo, Tarjeta</span>
            </div>
            <div className="flex items-center gap-1">
              <Receipt className="h-3 w-3" />
              <span>Ticket automático</span>
            </div>
          </div> */}
        {/* </div> */}
      </CardContent>
    </Card>
  )
}

export default ActionsSection 