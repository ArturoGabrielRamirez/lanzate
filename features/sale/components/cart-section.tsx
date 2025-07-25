"use client"

import { ShoppingBasket, Plus, Minus, X, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CartItem } from '../types'

type CartSectionProps = {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: number, newQuantity: number) => void
  onRemoveItem: (productId: number) => void
}

function CartSection({ cartItems, onUpdateQuantity, onRemoveItem }: CartSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <Card className='lg:area-[cart] h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingBasket />
          Carrito ({totalItems} items)
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
                      {/* <span>SKU: {item.product.sku}</span> */}
                      {/* <span>•</span> */}
                      <span>1 x {formatPrice(item.product.price)}</span>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.totalStock}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
 */}
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
          <div className="flex items-center justify-center grow border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <div className="text-center">
              <ShoppingBasket className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">
                El carrito está vacío
              </p>
              <p className="text-xs text-muted-foreground">
                Escanea o busca productos para agregar
              </p>
            </div>
          </div>
        )}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="text-lg py-1 px-3 font-bold">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CartSection 