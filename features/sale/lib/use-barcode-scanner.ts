"use client"

import { useCallback, useEffect, useRef, useState } from 'react'

import { getCharByKeyCode } from '@/features/sale/lib/keyboard-utils'
import type { BarcodeScannerConfig, BarcodeScannerHookOptions, BarcodeScannerHookReturn, ScannedData } from '@/features/sale/types'

const DEFAULT_CONFIG: BarcodeScannerConfig = {
  intervalBetweenKeyPress: 50, // 50ms between keypresses (scanners are typically ~25ms)
  scanningEndTimeout: 100, // 100ms timeout after scanning ends
  historyLength: 50, // Keep last 50 scans in history
  ignoreOnInputs: true, // Ignore when cursor is in input/textarea
  debug: false
}

export function useBarcodeScanner(options: BarcodeScannerHookOptions = {}): BarcodeScannerHookReturn {
  const {
    enabled = true,
    config: userConfig = {},
    onScanned,
    onScanStart,
    onScanEnd
  } = options

  const config = { ...DEFAULT_CONFIG, ...userConfig }

  const [isScanning, setIsScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<string[]>([])

  // Use refs to store mutable values that don't trigger re-renders
  const isBusyRef = useRef<NodeJS.Timeout | null>(null)
  const keyDownTimeRef = useRef<number | null>(null)
  const inputTextRef = useRef<string>('')

  const log = useCallback((...args: unknown[]) => {
    if (config.debug) {
      console.debug('[BarcodeScanner]', ...args)
    }
  }, [config.debug])

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const currentTime = Date.now()
    const character = getCharByKeyCode(event.keyCode, event.shiftKey)

    // Ignore keypresses without character
    if (character === '') return

    // Prevent Firefox fast search '/' when scanning is active
    if (isBusyRef.current) {
      event.preventDefault()
    }

    // Ignore if cursor is in input/textarea and ignoreOnInputs is enabled
    if (config.ignoreOnInputs &&
      event.target instanceof HTMLElement &&
      (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
      return
    }

    if (keyDownTimeRef.current === null) {
      // First keypress - start timer
      keyDownTimeRef.current = currentTime
      inputTextRef.current = character
      log('First keypress detected')
    } else {
      const timeDiff = currentTime - keyDownTimeRef.current

      if (timeDiff < config.intervalBetweenKeyPress) {
        // Fast keypresses detected - this is likely a barcode scanner
        inputTextRef.current += character

        if (isBusyRef.current === null) {
          // First fast keypress - start scanning mode
          setIsScanning(true)
          onScanStart?.()
          log('Scanning started')
        }

        // Clear previous timeout and set new one
        if (isBusyRef.current) {
          clearTimeout(isBusyRef.current)
        }

        isBusyRef.current = setTimeout(() => {
          // Scanning finished
          const scannedData = inputTextRef.current
          const scanData: ScannedData = {
            data: scannedData,
            timestamp: new Date()
          }

          log('Scan completed:', scannedData)

          setLastScanned(scannedData)
          setScanHistory(prev => {
            const newHistory = [scannedData, ...prev].slice(0, config.historyLength)
            return newHistory
          })

          onScanned?.(scanData)
          onScanEnd?.()

          // Reset state
          setIsScanning(false)
          isBusyRef.current = null
          inputTextRef.current = ''
          log('Scanning ended')
        }, config.scanningEndTimeout)
      } else {
        // Slow keypress - reset to single character
        inputTextRef.current = character
      }

      keyDownTimeRef.current = currentTime
    }
  }, [enabled, config, onScanned, onScanStart, onScanEnd, log])

  useEffect(() => {
    if (!enabled) return

    log('Scanner enabled with config:', config)

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
      if (isBusyRef.current) {
        clearTimeout(isBusyRef.current)
      }
      log('Scanner disabled')
    }
  }, [handleKeydown, enabled, config, log])

  return {
    isScanning,
    lastScanned,
    scanHistory
  }
} 