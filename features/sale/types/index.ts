export type BarcodeScannerConfig = {
  intervalBetweenKeyPress: number
  scanningEndTimeout: number
  historyLength: number
  ignoreOnInputs: boolean
  debug: boolean
}

export type ScannedData = {
  data: string
  timestamp: Date
}

export type BarcodeScannerHookOptions = {
  enabled?: boolean
  config?: Partial<BarcodeScannerConfig>
  onScanned?: (data: ScannedData) => void
  onScanStart?: () => void
  onScanEnd?: () => void
}

export type BarcodeScannerHookReturn = {
  isScanning: boolean
  lastScanned: string | null
  scanHistory: string[]
} 