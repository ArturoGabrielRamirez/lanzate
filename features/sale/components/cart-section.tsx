"use client"

import { ShoppingBasket, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { CartSectionProps } from '@/features/sale/types'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shadcn/components/ui/card'

function CartSection({ cartItems, onRemoveItem }: CartSectionProps) {
  const t = useTranslations('sale.cart')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <Card className='lg:area-[cart] h-full row-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingBasket />
          {t('title')} ({totalItems} {totalItems === 1 ? t('item') : t('items')})
        </CardTitle>
      </CardHeader>
      <CardContent className='h-full flex flex-col'>
        {cartItems.length > 0 ? (
          <div className="grow overflow-y-auto pr-4">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded border"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.quantity} x {formatPrice(item.product.price)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <div className="text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center grow border-2 border-dashed border-muted-foreground/20 rounded-lg py-4">
            <div className="text-center">
              <ShoppingBasket className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">
                {t('empty-title')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('empty-description')}
              </p>
            </div>
          </div>
        )}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t('total')}</span>
            <span className="text-lg py-1 px-3 font-bold">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { CartSection }