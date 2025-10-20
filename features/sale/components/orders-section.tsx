"use client"

import { Clock, Receipt, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shadcn/components/ui/card'
import { Badge } from '@/features/shadcn/components/ui/badge'
import { Button } from '@/features/shadcn/components/ui/button'

// Tipos temporales para demostración
type Order = {
  id: number
  total: number
  itemCount: number
  createdAt: Date
  status: 'completed' | 'refunded' | 'pending'
}

type OrdersSectionProps = {
  onViewOrderHistory: () => void
}

// Datos de ejemplo
const recentOrders: Order[] = [
  {
    id: 1001,
    total: 15650,
    itemCount: 3,
    createdAt: new Date(),
    status: 'completed'
  },
  {
    id: 1000,
    total: 8900,
    itemCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    status: 'completed'
  },
  {
    id: 999,
    total: 22300,
    itemCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'refunded'
  }
]

function OrdersSection({ onViewOrderHistory }: OrdersSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completada</Badge>
      case 'refunded':
        return <Badge variant="destructive">Reembolsada</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const totalToday = recentOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0)

  const ordersToday = recentOrders.filter(order => order.status === 'completed').length

  return (
    <Card className='area-[orders] h-fit'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock />
          Órdenes Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumen del día */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Ventas Hoy</div>
                <div className="text-lg font-bold">{ordersToday}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Hoy</div>
                <div className="text-lg font-bold">{formatPrice(totalToday)}</div>
              </div>
            </div>
          </div>

          {/* Lista de órdenes recientes */}
          {recentOrders.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">Orden #{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{order.itemCount} productos</span>
                      <span>•</span>
                      <span>{formatTime(order.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  No hay órdenes recientes
                </p>
                <p className="text-xs text-muted-foreground">
                  Las ventas aparecerán aquí
                </p>
              </div>
            </div>
          )}

          {/* Botón para ver historial completo */}
          <Button 
            onClick={onViewOrderHistory}
            variant="outline" 
            className="w-full"
            size="sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ver Historial Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrdersSection 