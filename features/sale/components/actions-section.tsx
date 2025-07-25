"use client"

import { Settings, CreditCard, RotateCcw, Trash2, Calculator, Receipt, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  cartTotal, 
  cartItemCount, 
  onFinalizeSale, 
  onRefund, 
  onClearCart, 
  onCalculateChange, 
  onPrintReceipt,
  disabled = false 
}: ActionsSectionProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  return (
    <Card className='area-[buttons] h-fit'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings />
          Acciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumen rápido */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total a cobrar</div>
              <div className="text-lg font-bold">{formatPrice(cartTotal)}</div>
              <div className="text-xs text-muted-foreground">{cartItemCount} productos</div>
            </div>
          </div>

          {/* Botones principales */}
          <div className="space-y-2">
            <Button 
              onClick={onFinalizeSale}
              disabled={disabled || cartItemCount === 0}
              className="w-full h-12 text-base"
              variant="default"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Finalizar Venta
            </Button>

            <Button 
              onClick={onCalculateChange}
              disabled={disabled || cartItemCount === 0}
              className="w-full"
              variant="outline"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Vuelto
            </Button>
          </div>

          <hr className="border-muted-foreground/20" />

          {/* Botones secundarios */}
          <div className="space-y-2">
            <Button 
              onClick={onPrintReceipt}
              disabled={disabled}
              className="w-full"
              variant="outline"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Imprimir Ticket
            </Button>

            <Button 
              onClick={onRefund}
              disabled={disabled}
              className="w-full"
              variant="outline"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Procesar Reembolso
            </Button>
          </div>

          <hr className="border-muted-foreground/20" />

          {/* Botones de utilidad */}
          <div className="space-y-2">
            <Button 
              onClick={onClearCart}
              disabled={disabled || cartItemCount === 0}
              className="w-full"
              variant="destructive"
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>Métodos: Efectivo, Tarjeta</span>
            </div>
            <div className="flex items-center gap-1">
              <Receipt className="h-3 w-3" />
              <span>Ticket automático</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActionsSection 