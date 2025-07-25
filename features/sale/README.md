# Sale Feature

Esta feature implementa la funcionalidad de ventas para las tiendas, incluyendo scanner de códigos de barras USB.

## Estructura

```
features/sale/
├── components/           # Componentes React
│   ├── barcode-scanner-usb.tsx
│   ├── barcode-scanner-demo.tsx
│   ├── barcode-scanner-button.tsx (legacy)
│   ├── store-selector.tsx
│   └── index.ts
├── lib/                 # Lógica y utilidades
│   ├── use-barcode-scanner.ts
│   └── keyboard-utils.ts
└── types/              # Definiciones de tipos
    └── index.ts
```

## Componentes Implementados

### 1. BarcodeScannerUSB
Scanner de códigos de barras que detecta eventos de teclado rápidos característicos de scanners USB.

**Características:**
- Detección automática de pulsaciones rápidas (típicas de scanners)
- Configuración personalizable de intervalos y timeouts
- Historial de códigos escaneados
- Modo debug para desarrollo
- Ignora inputs cuando el cursor está en campos de texto

**Uso:**
```tsx
import { BarcodeScannerUSB } from '@/features/sale/components'

function MyComponent() {
  const handleProductScanned = (barcode: string) => {
    console.log('Código escaneado:', barcode)
    // Lógica para buscar producto y agregarlo al carrito
  }

  return (
    <BarcodeScannerUSB 
      onProductScanned={handleProductScanned}
    />
  )
}
```

### 2. BarcodeScannerDemo
Componente de simulación para probar el scanner sin hardware físico.

**Características:**
- Simula eventos de teclado rápidos como un scanner real
- Códigos de barras predefinidos para pruebas rápidas
- Input personalizado para probar códigos específicos
- Interfaz visual clara para desarrollo y testing

### 3. useBarcodeScanner Hook
Hook personalizado que maneja toda la lógica del scanner.

**Configuración por defecto:**
- `intervalBetweenKeyPress`: 50ms
- `scanningEndTimeout`: 100ms  
- `historyLength`: 50 códigos
- `ignoreOnInputs`: true
- `debug`: false

**Callbacks disponibles:**
- `onScanned`: Se ejecuta cuando se completa un escaneo
- `onScanStart`: Se ejecuta cuando inicia la detección de escaneo
- `onScanEnd`: Se ejecuta cuando termina el escaneo

## Tipos TypeScript

### BarcodeScannerConfig
```typescript
type BarcodeScannerConfig = {
  intervalBetweenKeyPress: number  // Tiempo máximo entre teclas para considerar scanner
  scanningEndTimeout: number       // Tiempo de espera para finalizar escaneo
  historyLength: number           // Cantidad de códigos a mantener en historial
  ignoreOnInputs: boolean         // Ignorar cuando cursor está en inputs
  debug: boolean                  // Habilitar logs de debug
}
```

### ScannedData
```typescript
type ScannedData = {
  data: string      // El código de barras escaneado
  timestamp: Date   // Momento del escaneo
}
```

## Integración en Páginas

El componente está integrado en la página de ventas (`app/[locale]/sale/[slug]/page.tsx`) con:

1. **Scanner USB real**: Para uso en producción con dispositivos físicos
2. **Scanner simulado**: Para desarrollo y testing
3. **Área de productos**: Donde aparecen los productos escaneados

## Funcionamiento Técnico

### Detección de Scanner USB

Los scanners USB actúan como teclados y envían caracteres muy rápidamente:

1. **Detección de velocidad**: Si las teclas se presionan en menos de 50ms entre sí, se considera un scanner
2. **Acumulación**: Los caracteres se van acumulando durante el escaneo rápido
3. **Finalización**: Después de 100ms sin actividad, se considera completo el escaneo
4. **Callback**: Se ejecuta `onProductScanned` con el código completo

### Utilidades de Teclado

La función `getCharByKeyCode` convierte códigos de tecla a caracteres, soportando:
- Números (0-9)
- Letras (a-z, A-Z)
- Teclado numérico
- Caracteres especiales (-, +, /, etc.)
- Modificador Shift

## Desarrollo y Testing

### Modo Debug
Habilita logs detallados en consola:
```typescript
const { isScanning, lastScanned } = useBarcodeScanner({
  config: { debug: true }
})
```

### Simulación
Usa el componente `BarcodeScannerDemo` para simular scanners USB:
- Códigos predefinidos para pruebas rápidas
- Input personalizado para códigos específicos
- Simula la velocidad real de un scanner (25ms entre caracteres)

### Testing Manual
1. Conecta un scanner USB físico
2. Abre la página de ventas
3. Escanea códigos de barras
4. Verifica que aparezcan en el historial y se ejecuten los callbacks

## Próximas Mejoras

- [ ] Integración con base de datos de productos
- [ ] Carrito de compras funcional
- [ ] Soporte para diferentes formatos de códigos
- [ ] Configuración persistente del scanner
- [ ] Sonidos de confirmación
- [ ] Validación de códigos de barras 