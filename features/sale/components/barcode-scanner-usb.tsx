"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useBarcodeScanner } from '../lib/use-barcode-scanner'
import type { ScannedData } from '../types'
import { useTranslations } from 'next-intl'
import BarcodeScannerCammeraButton from './barcode-scanner-cammera-button'
import { ScanBarcode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BarcodeScannerUSBProps = {
  onProductScanned?: (barcode: string) => void
  className?: string
}

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

export default BarcodeScannerUSB 