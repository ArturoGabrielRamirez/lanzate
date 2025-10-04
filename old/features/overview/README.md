# Overview Feature

Este feature implementa el tab "Overview" para las tiendas, proporcionando una vista general de métricas y acciones rápidas.

## Estructura

```
features/overview/
├── components/           # Componentes React
│   ├── sales-overview-widget.tsx
│   ├── product-store-count-widget.tsx
│   ├── sales-by-month-widget.tsx
│   ├── top-products-widget.tsx
│   ├── quick-actions-bar.tsx
│   ├── overview-tab.tsx
│   └── index.ts
├── actions/             # Server Actions
│   └── get-overview-data.ts
├── data/               # Funciones de consulta DB
│   ├── get-sales-overview.ts
│   ├── get-product-store-count.ts
│   ├── get-sales-by-month.ts
│   └── get-top-products.ts
└── types/              # Definiciones de tipos
    └── index.ts
```

## Widgets Implementados

### 1. Sales Overview Widget
- **Métricas**: Ingresos totales, cantidad de órdenes, valor promedio por orden
- **Datos**: Basado en órdenes pagadas (`is_paid: true`)
- **Formato**: Moneda argentina (ARS)

### 2. Product Store Count Widget  
- **Métricas**: Total de productos, sucursales, productos activos, productos publicados
- **Datos**: Basado en productos de la tienda y sus branches
- **Iconos**: Diferenciados por tipo de métrica

### 3. Sales by Month Widget
- **Tipo**: Gráfico de barras (Chart de Shadcn + Recharts)
- **Datos**: Ventas e ingresos por mes (últimos 12 meses)
- **Características**: Interactivo con tooltips

### 4. Top Products Widget
- **Contenido**: Los 5 productos más vendidos
- **Métricas**: Cantidad vendida y revenue por producto
- **UI**: Lista con avatars, rankings y formato de moneda

## Barra de Acciones Rápidas

Proporciona acceso directo a:
- Crear nuevo producto
- Ver productos
- Ver órdenes  
- Gestionar empleados
- Configuración de tienda

## Integración

El tab está integrado en:
- **Navegación**: `/app/stores/[slug]/layout.tsx`
- **Routing**: `/app/stores/[slug]/[tab]/page.tsx`
- **Layout**: `/app/stores/[slug]/[tab]/layout.tsx`
- **Components**: `/features/stores/components/index.ts`

## Uso

```typescript
// El tab se accede automáticamente via routing dinámico
// URL: /stores/{slug}/overview

import { OverviewTab } from "@/features/overview/components"

<OverviewTab slug={storeSlug} userId={userId} />
```

## Tecnologías

- **UI**: Shadcn/ui + Tailwind CSS
- **Charts**: Recharts + Shadcn Chart components  
- **DB**: Prisma ORM
- **Types**: TypeScript con tipos específicos
- **Estado**: Server Components (sin estado cliente) 