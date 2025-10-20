"use client"

import { PaymentMethod } from '@prisma/client'
import { Trash2, Receipt } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CalculateChangeButton } from '@/features/sale/components/calculate-change-button'
import { FinalizeSaleButton } from '@/features/sale/components/finalize-sale-button'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

type CustomerInfo = {
  name: string
  phone: string
  email: string
}

type ActionsSectionProps = {
  cartTotal: number
  cartItemCount: number
  onFinalizeSale: (formData: { paymentMethod: PaymentMethod; customerInfo: CustomerInfo }) => Promise<{ error: boolean; payload: unknown; message: string }>
  onRefund: () => void
  onClearCart: () => void
  onCalculateChange: () => void
  onPrintReceipt: () => void
  disabled?: boolean
  selectedPaymentMethod: PaymentMethod
  setSelectedPaymentMethod: (method: PaymentMethod) => void
  customerInfo: CustomerInfo
  setCustomerInfo: (info: CustomerInfo) => void
  branchName?: string
}

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
  branchName
}: ActionsSectionProps) {
  const t = useTranslations('sale.actions')

  return (
    <Card className='lg:area-[buttons] h-fit'>
      <CardContent className='flex lg:grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2 flex-wrap justify-center lg:justify-start'>
        <FinalizeSaleButton
          cartTotal={cartTotal}
          cartItemCount={cartItemCount}
          onConfirm={onFinalizeSale}
          disabled={disabled}
          className="lg:w-full text-base"
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          branchName={branchName}
        />

        <CalculateChangeButton
          cartTotal={cartTotal}
          disabled={disabled || cartItemCount === 0}
          className="lg:w-full"
        />

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
          onClick={onClearCart}
          disabled={disabled || cartItemCount === 0}
          className="lg:w-full"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className='hidden lg:block'>{t('clear-cart')}</span>
        </Button>

      </CardContent>
    </Card>
  )
}

export { ActionsSection }