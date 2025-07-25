"use client"

import { useState } from 'react'
import { Zap, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BarcodeScannerDemoProps = {
  className?: string
}

const DEMO_BARCODES = [
  '7891234567890',
  '1234567890123',
  '9876543210987',
  '1122334455667',
  '7788990011223'
]

function BarcodeScannerDemo({ className }: BarcodeScannerDemoProps) {
  const [demoBarcode, setDemoBarcode] = useState('')

  const simulateScanner = (barcode: string) => {
    // Simulate rapid keypresses like a USB scanner would do
    const chars = barcode.split('')
    let currentInput = ''
    
    chars.forEach((char, index) => {
      setTimeout(() => {
        currentInput += char
        // Dispatch keyboard events to simulate scanner behavior
        const event = new KeyboardEvent('keydown', {
          key: char,
          keyCode: char.charCodeAt(0),
          bubbles: true
        })
        window.dispatchEvent(event)
        
        // If this is the last character, trigger a small delay to complete the scan
        if (index === chars.length - 1) {
          setTimeout(() => {
            console.log(`Demo: Simulated scan complete for ${barcode}`)
          }, 50)
        }
      }, index * 25) // 25ms between characters (typical scanner speed)
    })
  }

  const handleDemoScan = () => {
    if (demoBarcode.trim()) {
      simulateScanner(demoBarcode.trim())
      setDemoBarcode('')
    }
  }

  const handleQuickDemo = (barcode: string) => {
    simulateScanner(barcode)
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Demo Scanner USB
            <Badge variant="outline">Simulación</Badge>
          </CardTitle>
          <CardDescription>
            Simula un scanner USB para probar el componente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Custom barcode input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Código personalizado:</label>
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa un código de barras..."
                value={demoBarcode}
                onChange={(e) => setDemoBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDemoScan()
                  }
                }}
              />
              <Button 
                onClick={handleDemoScan}
                disabled={!demoBarcode.trim()}
                size="sm"
                className="flex items-center gap-1"
              >
                <Send className="size-4" />
                Simular
              </Button>
            </div>
          </div>

          {/* Quick demo buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Códigos de ejemplo:</label>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_BARCODES.map((barcode) => (
                <Button
                  key={barcode}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo(barcode)}
                  className="font-mono text-xs"
                >
                  {barcode}
                </Button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Uso:</strong> Utiliza este simulador para probar la funcionalidad del scanner 
              sin necesidad de un dispositivo físico. Los eventos se enviarán como si vinieran de un scanner USB real.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BarcodeScannerDemo 