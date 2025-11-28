"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'

import { getCharByKeyCode } from '@/features/sale/lib/keyboard-utils'
import type {
  BarcodeScannerConfig,
  BarcodeScannerHookOptions,
  BarcodeScannerHookReturn,
  ScannedData
} from '@/features/sale/types'

const DEFAULT_CONFIG: BarcodeScannerConfig = {
  intervalBetweenKeyPress: 50, // 50ms between keypresses
  scanningEndTimeout: 100,     // 100ms timeout after scanning ends
  historyLength: 50,            // Keep last 50 scans in history
  ignoreOnInputs: true,         // Ignore when cursor is in input/textarea
  debug: false
}

export function useBarcodeScanner(
  options: BarcodeScannerHookOptions = {}
): BarcodeScannerHookReturn {
  const {
    enabled = true,
    config: userConfig = {},
    onScanned,
    onScanStart,
    onScanEnd
  } = options

  // Memorizar configuración para evitar recrearla en cada render
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...userConfig }), [userConfig])

  const [isScanning, setIsScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<string[]>([])

  const isBusyRef = useRef<NodeJS.Timeout | null>(null)
  const keyDownTimeRef = useRef<number | null>(null)
  const inputTextRef = useRef<string>('')

  const log = useCallback((...args: unknown[]) => {
    if (config.debug) console.debug('[BarcodeScanner]', ...args)
  }, [config.debug])

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const currentTime = Date.now()

      //TODO: event.keyCode está obsoleto, considerar usar event.key
      const character = getCharByKeyCode(event.keyCode, event.shiftKey)

      if (character === '') return

      if (isBusyRef.current) event.preventDefault()

      if (
        config.ignoreOnInputs &&
        event.target instanceof HTMLElement &&
        (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')
      ) return

      if (keyDownTimeRef.current === null) {
        keyDownTimeRef.current = currentTime
        inputTextRef.current = character
        log('Primera pulsación de tecla detectada:'/* , character */)
      } else {
        const timeDiff = currentTime - keyDownTimeRef.current

        if (timeDiff < config.intervalBetweenKeyPress) {
          inputTextRef.current += character

          if (isBusyRef.current === null) {
            setIsScanning(true)
            onScanStart?.()
            log('Escaneo iniciado')
          }

          if (isBusyRef.current) clearTimeout(isBusyRef.current)

          isBusyRef.current = setTimeout(() => {
            const scannedData = inputTextRef.current
            const scanData: ScannedData = { data: scannedData, timestamp: new Date() }

            setLastScanned(scannedData)
            setScanHistory(prev => [scannedData, ...prev].slice(0, config.historyLength))

            onScanned?.(scanData)
            onScanEnd?.()

            setIsScanning(false)
            isBusyRef.current = null
            inputTextRef.current = ''
            log('Escaneo finalizado')
          }, config.scanningEndTimeout)
        } else {
          inputTextRef.current = character
        }

        keyDownTimeRef.current = currentTime
      }
    },
    [enabled, config, onScanned, onScanStart, onScanEnd, log]
  )

  useEffect(() => {
    if (!enabled) return

    log('Escáner habilitado con configuración:', config)
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      if (isBusyRef.current) clearTimeout(isBusyRef.current)
      log('Escáner deshabilitado')
    }
  }, [enabled, handleKeydown, log, config])

  return {
    isScanning,
    lastScanned,
    scanHistory
  }
}
