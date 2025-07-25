"use client"

import { useState } from 'react'
import { Store } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BarcodeScannerUSB from './barcode-scanner-usb'
import BarcodeScannerDemo from './barcode-scanner-demo'

type SaleInterfaceProps = {
  storeName: string
  storeDescription?: string
}

function SaleInterface({ storeName, storeDescription }: SaleInterfaceProps) {
  const [scannedProducts, setScannedProducts] = useState<string[]>([])

  const handleProductScanned = (barcode: string) => {
    console.log('Producto escaneado:', barcode)
    setScannedProducts(prev => [barcode, ...prev])
    // Aquí puedes agregar la lógica para buscar el producto por código de barras
    // y agregarlo al carrito de compras
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
      {/* Scanner de códigos de barras */}
      <div className="xl:col-span-1">
        <div className="space-y-4">
          <BarcodeScannerUSB 
            onProductScanned={handleProductScanned}
          />
          <BarcodeScannerDemo />
        </div>
      </div>
      
      {/* Área principal para productos escaneados y carrito */}
      <div className="xl:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="size-4" />
              {storeName} - Productos Escaneados
            </CardTitle>
            <CardDescription>
              {storeDescription || "Sin descripción disponible"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedProducts.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Códigos escaneados:</h3>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {scannedProducts.map((barcode, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-muted rounded border"
                    >
                      <code className="text-sm font-mono">{barcode}</code>
                      <span className="text-xs text-muted-foreground">
                        #{scannedProducts.length - index}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Escanea un código de barras para agregar productos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Usa el scanner USB real o el simulador para probar
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SaleInterface 