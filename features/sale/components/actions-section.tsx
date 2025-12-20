"use client"

import { Trash2, Receipt } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InlineShortcut } from '@/features/global/components'
import { CalculateChangeButton, FinalizeSaleButton } from '@/features/sale/components'
import type { ActionsSectionProps } from '@/features/sale/types'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function ActionsSection({
  cartTotal,
  cartItemCount,
  onFinalizeSale,
  onClearCart,
  onPrintReceipt,
  disabled = false,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  customerInfo,
  setCustomerInfo,
  branchName,
  isFinalizingSale
}: ActionsSectionProps) {
  const t = useTranslations('sale.actions')

  return (
    <Card className='lg:area-[buttons] h-fit'>
      <CardContent className='flex lg:grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2 flex-wrap justify-center lg:justify-start'>
        <FinalizeSaleButton
          cartTotal={cartTotal}
          cartItemCount={cartItemCount}
          onConfirm={onFinalizeSale}
          disabled={disabled || isFinalizingSale}
          className="lg:w-full text-base"
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          branchName={branchName}
          isFinalizingSale={isFinalizingSale}
        />

        <CalculateChangeButton
          cartTotal={cartTotal}
          disabled={disabled || cartItemCount === 0 || isFinalizingSale}
          className="lg:w-full"
        />

        <Button
          data-action="print-receipt"
          onClick={onPrintReceipt}
          disabled={disabled || isFinalizingSale}
          className="lg:w-full gap-2"
          variant="outline"
        >
          <Receipt className="h-4 w-4" />
          <span className='hidden lg:flex items-center gap-1'>
            {t('print-receipt')}
            <InlineShortcut keys={['P']} />
          </span>
        </Button>

        <Button
          data-action="clear-cart"
          onClick={onClearCart}
          disabled={disabled || cartItemCount === 0 || isFinalizingSale}
          className="lg:w-full gap-2"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className='hidden lg:flex items-center gap-1'>
            {t('clear-cart')}
            <InlineShortcut keys={['L']} />
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

export { ActionsSection }