"use client"

import { useState } from 'react'
import { Scan, Check, History, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleScanned = (data: ScannedData) => {
    onProductScanned?.(data.data)
  }

  const { isScanning, lastScanned, scanHistory } = useBarcodeScanner({
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
      {/* <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="size-5" />
            Scanner de Códigos de Barras USB
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? "Activado" : "Desactivado"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Conecta tu scanner USB y escanea códigos de productos
          </CardDescription>
        </CardHeader> */}

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
        {/* </div> */}

        {/* Last Scanned */}
        {/* {lastScanned && (
            <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Último código escaneado
                </span>
              </div>
              <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                {lastScanned}
              </code>
            </div>
          )} */}

        {/* Controls */}
        {/* <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              {showHistory ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              <History className="size-4" />
              Historial ({scanHistory.length})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2"
            >
              {showSettings ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              <Settings className="size-4" />
              Configuración
            </Button>
          </div>
 */}
        {/* History */}
        {/* {showHistory && (
            <div className="space-y-2">
              <div className="border rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">Historial de escaneos</h4>
                {scanHistory.length > 0 ? (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {scanHistory.map((code, index) => (
                      <div key={index} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay escaneos recientes</p>
                )}
              </div>
            </div>
          )} */}

        {/* Settings */}
        {/* {showSettings && (
            <div className="border rounded-lg p-3 space-y-3">
              <h4 className="text-sm font-medium">Configuración del Scanner</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Intervalo entre teclas: 50ms (óptimo para scanners USB)</p>
                <p>• Timeout de finalización: 100ms</p>
                <p>• Historial máximo: 20 códigos</p>
                <p>• Ignora inputs: Activado (no escanea en campos de texto)</p>
              </div>
            </div>
          )} */}

        {/* Instructions */}
        {/* <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Instrucciones:</strong> Conecta tu scanner USB y apunta hacia un código de barras. 
              El sistema detectará automáticamente las pulsaciones rápidas del scanner.
            </p>
          </div> */}
      </CardContent>
    </Card>
  )
}

export default BarcodeScannerUSB 