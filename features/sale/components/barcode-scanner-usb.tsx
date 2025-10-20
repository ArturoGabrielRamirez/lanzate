"use client"

import { ScanBarcode } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { BarcodeScannerCammeraButton } from '@/features/sale/components'
import { useBarcodeScanner } from '@/features/sale/lib/use-barcode-scanner'
import type { ScannedData, BarcodeScannerUSBProps } from '@/features/sale/types'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'
import { cn } from '@/lib/utils'

function BarcodeScannerUSB({ onProductScanned, className }: BarcodeScannerUSBProps) {
  const [enabled, setEnabled] = useState(true)
  const t = useTranslations('sale.scanner')

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
      console.log(t('start'))
    },
    onScanEnd: () => {
      console.log(t('completed'))
    }
  })

  return (
    <Card className={`!py-2 lg:!py-3 ${className || ''}`}>
      <CardContent className="flex justify-between grow gap-2">
        {/* Scanner Status */}
        {/* <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"> */}
        <div className="flex items-center gap-3">
          {isScanning ? (
            <>
              <div className="size-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{t('scanning')}</span>
            </>
          ) : (
            <>
              <div className="size-3 bg-gray-400 rounded-full" />
              <span className="text-xs lg:text-sm text-muted-foreground truncate hidden lg:block">
                {enabled ? t('waiting') : t('disabled')}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <BarcodeScannerCammeraButton onProductScanned={onProductScanned} />
          <Button variant="outline" size="icon" className={cn(enabled ? '!bg-green-500/50 text-white' : '!bg-gray-400 text-muted-foreground')} onClick={() => setEnabled(!enabled)}>
            <ScanBarcode />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { BarcodeScannerUSB }