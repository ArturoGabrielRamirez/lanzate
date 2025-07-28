"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useBarcodeScanner } from '../lib/use-barcode-scanner'
import type { ScannedData } from '../types'

type BarcodeScannerUSBProps = {
  onProductScanned?: (barcode: string) => void
  className?: string
}

function BarcodeScannerUSB({ onProductScanned, className }: BarcodeScannerUSBProps) {
  const [enabled, setEnabled] = useState(true)

  const handleScanned = (data: ScannedData) => {
    onProductScanned?.(data.data)
  }

  const { isScanning } = useBarcodeScanner({
    enabled,
    config: {
      debug: true, // Enable debug for development
      intervalBetweenKeyPress: 50,
      scanningEndTimeout: 100,
      historyLength: 20
    },
    onScanned: handleScanned,
    onScanStart: () => {
      console.log('Iniciando escaneo...')
    },
    onScanEnd: () => {
      console.log('Escaneo completado')
    }
  })

  return (
    <Card className={`lg:area-[barcode] ${className || ''}`}>
      <CardContent className="flex justify-between grow">
        {/* Scanner Status */}
        {/* <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"> */}
        <div className="flex items-center gap-3">
          {isScanning ? (
            <>
              <div className="size-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Escaneando...</span>
            </>
          ) : (
            <>
              <div className="size-3 bg-gray-400 rounded-full" />
              <span className="text-sm text-muted-foreground">
                {enabled ? "Esperando escaneo" : "Scanner desactivado"}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="scanner-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="scanner-enabled" className="text-sm">
            Activado
          </Label>
        </div>

      </CardContent>
    </Card>
  )
}

export default BarcodeScannerUSB 