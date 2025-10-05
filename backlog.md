# 📋 Product Backlog - Lanzate MVP

**Proyecto:** Tienda dinámica multi-sucursal  
**Versión:** v0.2  
**Última actualización:** 2025-10-05

---

## 📑 Índice

- [Nomenclatura y Convenciones](#nomenclatura-y-convenciones)
- [FASE 0: Infraestructura Base](#fase-0-infraestructura-base)
- [MVP 0.1: Autenticación + Dashboard + Tienda Base](#mvp-01-autenticación--dashboard--tienda-base)
- [MVP 0.2: Productos + Stock + Branches](#mvp-02-productos--stock--branches)
- [MVP 0.3: Tienda Pública y Pedidos](#mvp-03-tienda-pública-y-pedidos)
- [MVP 0.4: Onboarding y Tutorial](#mvp-04-onboarding-y-tutorial)
- [MVP 0.5: Social Features](#mvp-05-social-features)
- [MVP 0.6: Sistema de Empleados](#mvp-06-sistema-de-empleados)
- [v1.0: Planes Pagos + Mercado Pago](#v10-planes-pagos--mercado-pago)
- [Matriz de Dependencias](#matriz-de-dependencias)

---

## Nomenclatura y Convenciones

### Formato de ID de Tarea
`[FASE]-[MÓDULO]-[NÚMERO]`

Ejemplo: `MVP01-AUTH-001`

### Prioridades
- 🔴 **P0 (Critical):** Bloqueante, debe hacerse primero
- 🟠 **P1 (High):** Alta prioridad, core functionality
- 🟡 **P2 (Medium):** Importante pero no bloqueante
- 🟢 **P3 (Low):** Nice to have, optimizaciones

### Complejidad
- **XS:** < 2 horas
- **S:** 2-4 horas
- **M:** 4-8 horas (1 día)
- **L:** 1-2 días
- **XL:** 2-5 días

### Stack Types
- **DB:** Database schema, migrations
- **Backend:** Server actions, data functions
- **Frontend:** UI components, pages
- **Validation:** Schemas, form validation
- **Access:** Permission checks, RLS
- **Integration:** External APIs, services
- **Testing:** Unit, integration, E2E tests
- **DevOps:** CI/CD, deployment, config
- **Docs:** Documentation

---

## FASE 0: Infraestructura Base

> **Objetivo:** Setup inicial del proyecto, configuración de herramientas y arquitectura base

### 🗄️ Database & Schema

#### **INFRA-DB-001**
**Título:** Configurar Supabase proyecto y conexión
**Descripción:** 
- Crear proyecto Supabase (staging y producción)
- Obtener credentials (URL, anon key, service role key)
- Configurar variables de entorno (.env.local)
- Verificar conectividad desde Next.js

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** DevOps, DB  
**Dependencias:** Ninguna

---

#### **INFRA-DB-002**
**Título:** Configurar Prisma ORM
**Descripción:** 
- Instalar Prisma CLI y cliente
- Configurar prisma/schema.prisma con datasource Supabase
- Setup scripts en package.json (generate, migrate, studio)
- Crear cliente Prisma singleton para Next.js

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-001

---

#### **INFRA-DB-003**
**Título:** Crear schema base de usuarios y autenticación
**Descripción:** 
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  avatar_url    String?
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
}
```
- Crear migración inicial
- Aplicar migración en staging

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-002

---

#### **INFRA-DB-004**
**Título:** Crear schema de tiendas (stores)
**Descripción:** 
```prisma
model Store {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  subdomain   String   @unique
  owner_id    String
  is_active   Boolean  @default(true)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  owner       User     @relation(fields: [owner_id], references: [id])
}
```
- Índices en subdomain y slug
- Constraint para subdomain válido (lowercase, no espacios)

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-003

---

#### **INFRA-DB-005**
**Título:** Crear schema de sucursales (branches)
**Descripción:** 
```prisma
model Branch {
  id                          String   @id @default(uuid())
  store_id                    String
  name                        String
  location                    String
  stock_distribution_enabled  Boolean  @default(true)
  created_at                  DateTime @default(now())
  
  store                       Store    @relation(fields: [store_id], references: [id])
}
```
- Índice en store_id
- Default branch creada automáticamente con trigger

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-004

---

#### **INFRA-DB-006**
**Título:** Crear schema de productos
**Descripción:** 
```prisma
model Product {
  id            String   @id @default(uuid())
  store_id      String
  category_id   String?
  name          String
  description   String?
  price         Decimal
  sku           String
  barcode       String?
  main_picture  String?
  pictures      String[]
  is_active     Boolean  @default(true)
  is_published  Boolean  @default(false)
  is_featured   Boolean  @default(false)
  
  // Campos dinámicos opcionales
  width         Float?
  height        Float?
  depth         Float?
  circumference Float?
  weight        Float?
  colors        String[]
  textures      String[]
  fragrances    String[]
  flavors       String[]
  sizes         String[]
  expiration_date DateTime?
  
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  store         Store    @relation(fields: [store_id], references: [id])
  category      Category? @relation(fields: [category_id], references: [id])
}
```
- Índices en store_id, sku, is_published
- Full-text search en name y description

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** DB  
**Dependencias:** INFRA-DB-004

---

#### **INFRA-DB-007**
**Título:** Crear schema de variantes de productos
**Descripción:** 
```prisma
model ProductVariant {
  id          String   @id @default(uuid())
  product_id  String
  sku         String   @unique
  attributes  Json     // {color: "red", size: "M"}
  price       Decimal? // Override del precio base
  created_at  DateTime @default(now())
  
  product     Product  @relation(fields: [product_id], references: [id])
}
```
- Índices en product_id y sku
- Unique constraint en (product_id, attributes)

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-006

---

#### **INFRA-DB-008**
**Título:** Crear schema de categorías
**Descripción:** 
```prisma
model Category {
  id         String   @id @default(uuid())
  store_id   String
  name       String
  slug       String
  created_at DateTime @default(now())
  
  store      Store    @relation(fields: [store_id], references: [id])
  
  @@unique([store_id, slug])
}
```
- Índice en store_id
- Unique constraint para slug por tienda

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-004

---

#### **INFRA-DB-009**
**Título:** Crear schema de stock
**Descripción:** 
```prisma
model Stock {
  id         String   @id @default(uuid())
  branch_id  String
  product_id String?
  variant_id String?
  quantity   Int      @default(0)
  updated_at DateTime @updatedAt
  
  branch     Branch          @relation(fields: [branch_id], references: [id])
  product    Product?        @relation(fields: [product_id], references: [id])
  variant    ProductVariant? @relation(fields: [variant_id], references: [id])
  
  @@unique([branch_id, product_id, variant_id])
}
```
- Check constraint: quantity >= 0
- Unique para evitar duplicados
- Trigger para actualizar updated_at

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** DB  
**Dependencies:** INFRA-DB-005, INFRA-DB-006, INFRA-DB-007

---

#### **INFRA-DB-010**
**Título:** Crear schema de pedidos (orders)
**Descripción:** 
```prisma
enum OrderStatus {
  pending
  confirmed
  in_transit
  ready_pickup
  delivered
  cancelled
}

enum DeliveryMethod {
  pickup
  shipping
}

model Order {
  id              String         @id @default(uuid())
  store_id        String
  branch_id       String
  customer_id     String
  status          OrderStatus    @default(pending)
  delivery_method DeliveryMethod @default(pickup)
  total           Decimal
  
  // Shipping info
  shipping_courier         String?
  shipping_tracking_number String?
  shipping_tracking_url    String?
  shipping_address         Json?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  store    Store  @relation(fields: [store_id], references: [id])
  branch   Branch @relation(fields: [branch_id], references: [id])
  customer User   @relation(fields: [customer_id], references: [id])
}
```

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-003, INFRA-DB-004, INFRA-DB-005

---

#### **INFRA-DB-011**
**Título:** Crear schema de items de pedido (order_items)
**Descripción:** 
```prisma
model OrderItem {
  id              String  @id @default(uuid())
  order_id        String
  product_id      String
  variant_id      String?
  quantity        Int
  price_at_time   Decimal // Precio al momento del pedido
  
  order   Order          @relation(fields: [order_id], references: [id])
  product Product        @relation(fields: [product_id], references: [id])
  variant ProductVariant? @relation(fields: [variant_id], references: [id])
}
```
- Índice en order_id
- price_at_time para histórico de precios

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-010

---

#### **INFRA-DB-012**
**Título:** Crear schema de activity logs
**Descripción:** 
```prisma
enum LogStatus {
  success
  error
}

model ActivityLog {
  id           String    @id @default(uuid())
  user_id      String
  store_id     String?
  action_type  String    // "product.create", "stock.transfer"
  entity_type  String    // "product", "order", "branch"
  entity_id    String
  changes      Json?     // before/after para updates
  metadata     Json?
  ip_address   String?
  user_agent   String?
  status       LogStatus @default(success)
  error_message String?
  duration_ms  Int?
  created_at   DateTime  @default(now())
  
  user  User   @relation(fields: [user_id], references: [id])
  store Store? @relation(fields: [store_id], references: [id])
  
  @@index([user_id, created_at])
  @@index([store_id, created_at])
  @@index([action_type])
}
```

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-003, INFRA-DB-004

---

#### **INFRA-DB-013**
**Título:** Crear schema de likes en productos
**Descripción:** 
```prisma
model ProductLike {
  id         String   @id @default(uuid())
  product_id String
  user_id    String
  created_at DateTime @default(now())
  
  product Product @relation(fields: [product_id], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [user_id], references: [id])
  
  @@unique([product_id, user_id])
  @@index([product_id])
}
```
- Unique constraint para 1 like por usuario por producto

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-006, INFRA-DB-003

---

#### **INFRA-DB-014**
**Título:** Crear schema de comentarios en productos
**Descripción:** 
```prisma
model ProductComment {
  id         String   @id @default(uuid())
  product_id String
  user_id    String
  comment    String   @db.VarChar(500)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  
  product Product @relation(fields: [product_id], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [user_id], references: [id])
  
  @@index([product_id, created_at])
}
```
- Límite de 500 caracteres
- Ordenado por fecha para mostrar

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-006, INFRA-DB-003

---

#### **INFRA-DB-015**
**Título:** Crear schema de social feed
**Descripción:** 
```prisma
enum FeedItemType {
  order
  like
  comment
}

model FeedItem {
  id         String       @id @default(uuid())
  store_id   String
  type       FeedItemType
  user_id    String       // quien realizó la acción
  product_id String?
  order_id   String?
  comment_id String?
  message    String       // texto formateado pre-renderizado
  created_at DateTime     @default(now())
  
  store   Store           @relation(fields: [store_id], references: [id])
  user    User            @relation(fields: [user_id], references: [id])
  product Product?        @relation(fields: [product_id], references: [id])
  order   Order?          @relation(fields: [order_id], references: [id])
  comment ProductComment? @relation(fields: [comment_id], references: [id])
  
  @@index([store_id, created_at])
  @@index([type])
}
```
- Índices para queries rápidas por tienda
- Limpieza automática >30 días con cron job

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-004, INFRA-DB-003, INFRA-DB-006, INFRA-DB-010, INFRA-DB-014

---

#### **INFRA-DB-016**
**Título:** Crear schema de empleados e invitaciones
**Descripción:** 
```prisma
enum InvitationStatus {
  pending
  accepted
  rejected
  expired
}

model EmployeeInvitation {
  id            String           @id @default(uuid())
  store_id      String
  inviter_id    String           // owner que invita
  invitee_email String
  invitee_id    String?          // si ya existe en la plataforma
  status        InvitationStatus @default(pending)
  permissions   Json             // objeto con permisos granulares
  expires_at    DateTime
  created_at    DateTime         @default(now())
  updated_at    DateTime         @updatedAt
  
  store    Store @relation(fields: [store_id], references: [id])
  inviter  User  @relation("InvitationsSent", fields: [inviter_id], references: [id])
  invitee  User? @relation("InvitationsReceived", fields: [invitee_id], references: [id])
  
  @@index([invitee_email])
  @@index([store_id, status])
}

model StoreEmployee {
  id          String   @id @default(uuid())
  store_id    String
  user_id     String
  permissions Json     // permisos activos
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  store Store @relation(fields: [store_id], references: [id])
  user  User  @relation(fields: [user_id], references: [id])
  
  @@unique([store_id, user_id])
  @@index([user_id])
}
```

**Prioridad:** 🟡 P2  
**Complejidad:** L  
**Stack:** DB  
**Dependencias:** INFRA-DB-004, INFRA-DB-003

---

#### **INFRA-DB-017**
**Título:** Crear schema de planes y facturación
**Descripción:** 
```prisma
enum PlanType {
  free
  pro
  enterprise
}

model AccountPlan {
  id              String   @id @default(uuid())
  user_id         String   @unique
  plan_type       PlanType @default(free)
  valid_until     DateTime?
  stripe_customer_id String?
  mp_customer_id     String? // Mercado Pago customer ID
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  user User @relation(fields: [user_id], references: [id])
}

model BillingHistory {
  id              String   @id @default(uuid())
  user_id         String
  amount          Decimal
  currency        String   @default("ARS")
  status          String   // "pending", "paid", "failed"
  payment_method  String   // "mercadopago", "stripe"
  external_id     String?  // ID de la transacción en MP/Stripe
  metadata        Json?
  created_at      DateTime @default(now())
  
  user User @relation(fields: [user_id], references: [id])
  
  @@index([user_id, created_at])
}
```

**Prioridad:** 🟢 P3  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-003

---

#### **INFRA-DB-018**
**Título:** Configurar Row-Level Security (RLS) básico
**Descripción:** 
- Habilitar RLS en todas las tablas principales
- Política para Store: users solo ven sus propias tiendas
- Política para Product: filtrado por store_id del owner
- Política para Order: customers ven sus pedidos, owners ven pedidos de su tienda
- Documentar políticas en archivo SQL

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** DB, Access  
**Dependencias:** INFRA-DB-004, INFRA-DB-006, INFRA-DB-010

---

#### **INFRA-DB-019**
**Título:** Crear triggers para branch inicial
**Descripción:** 
- Trigger que crea automáticamente un branch "Principal" al crear una Store
- Función PL/pgSQL en Supabase
- Testing de trigger

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** DB  
**Dependencias:** INFRA-DB-004, INFRA-DB-005

---

#### **INFRA-DB-020**
**Título:** Crear triggers para feed items
**Descripción:** 
- Trigger after insert en Order → crear FeedItem tipo "order"
- Trigger after insert en ProductLike → crear FeedItem tipo "like"
- Trigger after insert en ProductComment → crear FeedItem tipo "comment"
- Función helper para formatear mensaje

**Prioridad:** 🟡 P2  
**Complejidad:** L  
**Stack:** DB  
**Dependencias:** INFRA-DB-015, INFRA-DB-010, INFRA-DB-013, INFRA-DB-014

---

### 🔧 Backend Infrastructure

#### **INFRA-BE-001**
**Título:** Crear utility de cliente Prisma singleton
**Descripción:** 
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Prioridad:** 🔴 P0  
**Complejidad:** XS  
**Stack:** Backend  
**Dependencias:** INFRA-DB-002

---

#### **INFRA-BE-002**
**Título:** Crear action-wrapper utility para logging automático
**Descripción:** 
- Wrapper que captura errores
- Registra automáticamente en ActivityLog
- Captura timing (duration_ms)
- Retorna formato estandarizado: `{ payload, hasError, error, message }`
- Maneja errores de Prisma específicos

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** INFRA-BE-001, INFRA-DB-012

---

#### **INFRA-BE-003**
**Título:** Crear format-server-response utility
**Descripción:** 
```typescript
export type ServerResponse<T> = {
  payload?: T;
  hasError: boolean;
  error?: string;
  message?: string;
}

export function formatSuccess<T>(payload: T, message?: string): ServerResponse<T>
export function formatError(error: string, message?: string): ServerResponse<never>
```

**Prioridad:** 🔴 P0  
**Complejidad:** XS  
**Stack:** Backend  
**Dependencias:** Ninguna

---

#### **INFRA-BE-004**
**Título:** Configurar Supabase client para Server Components
**Descripción:** 
- Crear `lib/supabase/server.ts`
- Client con cookies para SSR
- Helper `createServerClient()`
- Type-safe con TypeScript

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** INFRA-DB-001

---

#### **INFRA-BE-005**
**Título:** Configurar Supabase client para Client Components
**Descripción:** 
- Crear `lib/supabase/client.ts`
- Client con localStorage
- Helper `createBrowserClient()`
- Manejo de sesiones

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend  
**Dependencias:** INFRA-DB-001

---

#### **INFRA-BE-006**
**Título:** Crear middleware para subdomain detection
**Descripción:** 
- Middleware en `middleware.ts`
- Extraer subdomain del host
- Validar si es tienda pública vs dashboard
- Setear en headers/cookies para acceso posterior
- Redireccionar según contexto

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Backend  
**Dependencias:** INFRA-DB-004

---

#### **INFRA-BE-007**
**Título:** Crear utility para validar permisos de empleados
**Descripción:** 
```typescript
// features/global/utils/check-permission.ts
type Permission = 'view_products' | 'edit_products' | 'manage_stock' | ...

export async function checkPermission(
  userId: string,
  storeId: string,
  permission: Permission
): Promise<boolean>
```
- Cachear permisos en memoria
- Verificar owner vs employee

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Access  
**Dependencias:** INFRA-DB-016

---

### 🎨 Frontend Infrastructure

#### **INFRA-FE-001**
**Título:** Configurar Tailwind CSS + Shadcn UI
**Descripción:** 
- Instalar y configurar Tailwind
- Setup Shadcn CLI
- Configurar theme en tailwind.config
- Añadir globals.css con variables CSS

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** Ninguna

---

#### **INFRA-FE-002**
**Título:** Instalar componentes base de Shadcn
**Descripción:** 
Componentes iniciales necesarios:
- Button
- Input
- Label
- Form
- Card
- Dialog
- DropdownMenu
- Select
- Textarea
- Toast/Sonner
- Skeleton
- Badge
- Tabs

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-001

---

#### **INFRA-FE-003**
**Título:** Configurar next-intl para i18n
**Descripción:** 
- Instalar next-intl
- Crear `/messages/es.json` y `/messages/en.json`
- Configurar i18n routing en Next.js
- Crear `i18n/request.ts` y `i18n/navigation.ts`
- Wrapper de componentes con locale

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Frontend  
**Dependencias:** Ninguna

---

#### **INFRA-FE-004**
**Título:** Crear layout root con locale
**Descripción:** 
```typescript
// app/[locale]/layout.tsx
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
})
```
- Metadata dinámica según locale
- Font optimization
- Providers (theme, toast)

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend  
**Dependencias:** INFRA-FE-003

---

#### **INFRA-FE-005**
**Título:** Crear componentes de carga (Skeletons)
**Descripción:** 
- `<CardSkeleton />`
- `<TableSkeleton />`
- `<FormSkeleton />`
- `<ProductGridSkeleton />`
- Usar Shadcn Skeleton component

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **INFRA-FE-006**
**Título:** Crear componente ErrorBoundary
**Descripción:** 
- Error boundary para capturar errores de React
- Componente `<ErrorFallback />` con UI amigable
- Botón para "Try again"
- Logging de errores

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Frontend  
**Dependencias:** INFRA-FE-002

---

#### **INFRA-FE-007**
**Título:** Configurar GSAP para animaciones
**Descripción:** 
- Instalar GSAP
- Crear hooks: `useGSAP`, `useScrollTrigger`
- Configurar para SSR de Next.js
- Ejemplos de animaciones comunes

**Prioridad:** 🟢 P3  
**Complejidad:** M  
**Stack:** Frontend  
**Dependencias:** Ninguna

---

### 🧪 Testing Infrastructure

#### **INFRA-TEST-001**
**Título:** Configurar Vitest para unit tests
**Descripción:** 
- Instalar Vitest
- Configurar `vitest.config.ts`
- Setup para testing de utilities
- Scripts en package.json

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Testing  
**Dependencias:** Ninguna

---

#### **INFRA-TEST-002**
**Título:** Configurar Testing Library
**Descripción:** 
- @testing-library/react
- @testing-library/jest-dom
- Setup para testing de componentes
- Mock de next/navigation

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Testing  
**Dependencias:** INFRA-TEST-001

---

#### **INFRA-TEST-003**
**Título:** Configurar Playwright para E2E
**Descripción:** 
- Instalar Playwright
- Configurar navegadores (chromium, firefox)
- Setup de test database (Supabase staging)
- Scripts para E2E tests

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Testing  
**Dependencias:** Ninguna

---

### 🚀 DevOps Infrastructure

#### **INFRA-DEVOPS-001**
**Título:** Configurar variables de entorno
**Descripción:** 
Crear `.env.example` con:
```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```
- Documentar cada variable
- Setup en Vercel

**Prioridad:** 🔴 P0  
**Complejidad:** XS  
**Stack:** DevOps  
**Dependencias:** INFRA-DB-001

---

#### **INFRA-DEVOPS-002**
**Título:** Configurar ESLint + Prettier
**Descripción:** 
- ESLint config para Next.js + TypeScript
- Prettier config
- Scripts en package.json
- VSCode settings

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** DevOps  
**Dependencias:** Ninguna

---

#### **INFRA-DEVOPS-003**
**Título:** Configurar GitHub Actions para CI
**Descripción:** 
```yaml
# .github/workflows/ci.yml
- Lint
- Type check
- Unit tests
- Build validation
```
- Ejecutar en PRs
- Cache de dependencias

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** DevOps  
**Dependencias:** INFRA-DEVOPS-002, INFRA-TEST-001

---

#### **INFRA-DEVOPS-004**
**Título:** Setup Vercel deployment
**Descripción:** 
- Conectar repo con Vercel
- Configurar preview deployments
- Setup production branch
- Configurar variables de entorno
- Custom domain setup (placeholder)

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** DevOps  
**Dependencias:** INFRA-DEVOPS-001

---

#### **INFRA-DEVOPS-005**
**Título:** Configurar Supabase Storage buckets
**Descripción:** 
- Crear bucket `product-images`
- Crear bucket `store-logos`
- Crear bucket `store-banners`
- Configurar RLS policies para cada bucket
- Setup de limits (5MB, formatos permitidos)

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** DevOps, DB  
**Dependencias:** INFRA-DB-001

---

---

## MVP 0.1: Autenticación + Dashboard + Tienda Base

> **Objetivo:** Sistema de autenticación completo, dashboard funcional y CRUD básico de tiendas

### 🔐 Autenticación

#### **MVP01-AUTH-001**
**Título:** Crear página de login
**Descripción:** 
- Ruta: `/[locale]/login`
- Form con email y password
- Link a "Forgot password"
- Link a "Sign up"
- Responsive design
- Animaciones con GSAP (opcional)

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002, INFRA-FE-004

---

#### **MVP01-AUTH-002**
**Título:** Crear schema de validación para login
**Descripción:** 
```typescript
// features/auth/schemas/login.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```
- Mensajes de error en español e inglés

**Prioridad:** 🔴 P0  
**Complejidad:** XS  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP01-AUTH-003**
**Título:** Crear componente LoginForm
**Descripción:** 
- Usar react-hook-form + zod
- Integración con loginSchema
- Estados de loading
- Error handling con toast
- Client component

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI, Validation  
**Dependencias:** MVP01-AUTH-001, MVP01-AUTH-002, INFRA-FE-002

---

#### **MVP01-AUTH-004**
**Título:** Crear action function para login
**Descripción:** 
```typescript
// features/auth/actions/login.action.ts
'use server'

export async function loginAction(data: LoginInput): Promise<ServerResponse<User>>
```
- Llamar a Supabase auth.signInWithPassword
- Manejar errores (invalid credentials, etc.)
- Usar actionWrapper para logging
- Retornar usuario autenticado

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-AUTH-002, INFRA-BE-002, INFRA-BE-004

---

#### **MVP01-AUTH-005**
**Título:** Crear access function para validar autenticación
**Descripción:** 
```typescript
// features/auth/access/validate-auth.access.ts
'use server'

export async function validateAuth(): Promise<ServerResponse<User | null>>
```
- Obtener sesión de Supabase
- Retornar null si no hay sesión
- Retornar usuario si está autenticado

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, Access  
**Dependencias:** INFRA-BE-004

---

#### **MVP01-AUTH-006**
**Título:** Crear página de signup
**Descripción:** 
- Ruta: `/[locale]/signup`
- Form con name, email, password, confirmPassword
- Link a login
- Responsive design

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002, INFRA-FE-004

---

#### **MVP01-AUTH-007**
**Título:** Crear schema de validación para signup
**Descripción:** 
```typescript
export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})
```

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP01-AUTH-008**
**Título:** Crear componente SignupForm
**Descripción:** 
- Similar a LoginForm
- Validación de password strength indicator
- Checkbox de términos y condiciones
- Client component

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI, Validation  
**Dependencias:** MVP01-AUTH-006, MVP01-AUTH-007

---

#### **MVP01-AUTH-009**
**Título:** Crear action function para signup
**Descripción:** 
```typescript
// features/auth/actions/signup.action.ts
'use server'

export async function signupAction(data: SignupInput): Promise<ServerResponse<void>>
```
- Llamar a Supabase auth.signUp
- Crear registro en tabla User (si no auto)
- Enviar email de confirmación
- Redirigir a check-email page

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-AUTH-007, INFRA-BE-002, INFRA-BE-004, INFRA-DB-003

---

#### **MVP01-AUTH-010**
**Título:** Crear data function para crear usuario
**Descripción:** 
```typescript
// features/auth/data/create-user.data.ts
'use server'

export async function createUser(data: CreateUserInput): Promise<User>
```
- Insertar en tabla User
- Valores por defecto
- Manejar errores de unique constraint

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-003, INFRA-BE-001

---

#### **MVP01-AUTH-011**
**Título:** Crear página de check-email
**Descripción:** 
- Ruta: `/[locale]/check-email`
- Mensaje: "Revisa tu email para confirmar tu cuenta"
- Link para reenviar email
- Diseño simple

**Prioridad:** 🟠 P1  
**Complejidad:** XS  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-004

---

#### **MVP01-AUTH-012**
**Título:** Crear ruta de callback para confirmación
**Descripción:** 
- Ruta: `/auth/callback`
- Manejar token de confirmación de email
- Actualizar sesión
- Redirigir a dashboard
- Manejar errores

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** INFRA-BE-004

---

#### **MVP01-AUTH-013**
**Título:** Crear página de forgot-password
**Descripción:** 
- Ruta: `/[locale]/forgot-password`
- Form con solo email
- Mensaje de confirmación

**Prioridad:** 🟡 P2  
**Complejidad:** XS  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002, INFRA-FE-004

---

#### **MVP01-AUTH-014**
**Título:** Crear action para reset password
**Descripción:** 
```typescript
// features/auth/actions/forgot-password.action.ts
'use server'

export async function forgotPasswordAction(email: string): Promise<ServerResponse<void>>
```
- Llamar a Supabase auth.resetPasswordForEmail
- Enviar email con link de reset

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** INFRA-BE-004

---

#### **MVP01-AUTH-015**
**Título:** Crear página de reset-password
**Descripción:** 
- Ruta: `/[locale]/reset-password`
- Form con new password y confirm
- Validación de token en URL

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002, INFRA-FE-004

---

#### **MVP01-AUTH-016**
**Título:** Crear action para update password
**Descripción:** 
```typescript
// features/auth/actions/update-password.action.ts
'use server'

export async function updatePasswordAction(newPassword: string): Promise<ServerResponse<void>>
```
- Llamar a Supabase auth.updateUser
- Validar token actual

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** INFRA-BE-004

---

#### **MVP01-AUTH-017**
**Título:** Configurar Google OAuth
**Descripción:** 
- Configurar Google OAuth en Supabase console
- Obtener Client ID y Secret
- Añadir botón "Continue with Google" en login/signup
- Manejar callback

**Prioridad:** 🟢 P3  
**Complejidad:** M  
**Stack:** Backend, Integration  
**Dependencias:** INFRA-BE-004

---

#### **MVP01-AUTH-018**
**Título:** Crear action para logout
**Descripción:** 
```typescript
// features/auth/actions/logout.action.ts
'use server'

export async function logoutAction(): Promise<ServerResponse<void>>
```
- Llamar a Supabase auth.signOut
- Limpiar cookies
- Redirigir a login

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** INFRA-BE-004

---

### 🏠 Dashboard Base

#### **MVP01-DASH-001**
**Título:** Crear layout del dashboard
**Descripción:** 
- Ruta: `/[locale]/dashboard/layout.tsx`
- Sidebar con navegación
- Header con user menu
- Protección con middleware (auth required)
- Responsive (mobile drawer)

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002, INFRA-FE-004, MVP01-AUTH-005

---

#### **MVP01-DASH-002**
**Título:** Crear componente Sidebar
**Descripción:** 
- Links: Home, Stores, Account
- Active state highlighting
- Iconos con lucide-react
- Collapsible en mobile

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP01-DASH-003**
**Título:** Crear componente Header/UserMenu
**Descripción:** 
- Avatar del usuario
- Dropdown con: Account, Logout
- Badge de notificaciones (placeholder)
- Theme toggle (opcional)

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP01-DASH-004**
**Título:** Crear página Home del dashboard
**Descripción:** 
- Ruta: `/[locale]/dashboard/home`
- Cards con métricas básicas (tiendas, productos)
- Bienvenida personalizada
- Link rápido a crear tienda

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencies:** MVP01-DASH-001, INFRA-FE-002

---

#### **MVP01-DASH-005**
**Título:** Crear data function para obtener stats del usuario
**Descripción:** 
```typescript
// features/dashboard/data/get-user-stats.data.ts
'use server'

export async function getUserStats(userId: string): Promise<UserStats>
```
- Count de tiendas del usuario
- Count total de productos
- Otros stats básicos

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-DB-006, INFRA-BE-001

---

#### **MVP01-DASH-006**
**Título:** Crear action para obtener stats del usuario
**Descripción:** 
```typescript
// features/dashboard/actions/get-user-stats.action.ts
'use server'

export async function getUserStatsAction(): Promise<ServerResponse<UserStats>>
```
- Validar usuario autenticado
- Llamar a data function
- Usar actionWrapper

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP01-DASH-005, INFRA-BE-002, MVP01-AUTH-005

---

### 🏪 Tiendas (Stores) - CRUD Básico

#### **MVP01-STORE-001**
**Título:** Crear página de listado de tiendas
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores`
- Grid de cards con tiendas
- Botón "Create Store" prominente
- Cada card muestra: name, subdomain, is_active
- Link para editar/ver detalles

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-DASH-001, INFRA-FE-002

---

#### **MVP01-STORE-002**
**Título:** Crear data function para listar tiendas del usuario
**Descripción:** 
```typescript
// features/stores/data/list-user-stores.data.ts
'use server'

export async function listUserStores(userId: string): Promise<Store[]>
```
- SELECT * FROM Store WHERE owner_id = ?
- Ordenar por created_at DESC

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP01-STORE-003**
**Título:** Crear action para listar tiendas del usuario
**Descripción:** 
```typescript
// features/stores/actions/list-user-stores.action.ts
'use server'

export async function listUserStoresAction(): Promise<ServerResponse<Store[]>>
```
- Validar auth
- Llamar a data function
- Logging

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP01-STORE-002, INFRA-BE-002, MVP01-AUTH-005

---

#### **MVP01-STORE-004**
**Título:** Crear componente StoreCard
**Descripción:** 
- Card de Shadcn
- Muestra: logo (placeholder), name, subdomain
- Badge de status (active/inactive)
- Botones: View, Edit

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP01-STORE-005**
**Título:** Crear modal/página para crear tienda
**Descripción:** 
- Puede ser modal o página nueva
- Form con: name, subdomain
- Validación en tiempo real de subdomain disponible
- Preview de URL

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP01-STORE-006**
**Título:** Crear schema de validación para crear tienda
**Descripción:** 
```typescript
// features/stores/schemas/create-store.schema.ts
export const createStoreSchema = z.object({
  name: z.string().min(2).max(50),
  subdomain: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9-]+$/)
    .refine(async (subdomain) => {
      // check availability
    })
})
```

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP01-STORE-007**
**Título:** Crear componente CreateStoreForm
**Descripción:** 
- react-hook-form + zod
- Input para name
- Input para subdomain con validación async
- Loading states
- Submit button

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI, Validation  
**Dependencias:** MVP01-STORE-005, MVP01-STORE-006

---

#### **MVP01-STORE-008**
**Título:** Crear data function para verificar subdomain disponible
**Descripción:** 
```typescript
// features/stores/data/check-subdomain-available.data.ts
'use server'

export async function checkSubdomainAvailable(subdomain: string): Promise<boolean>
```
- Query a Store table
- Return true si no existe

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP01-STORE-009**
**Título:** Crear data function para crear tienda
**Descripción:** 
```typescript
// features/stores/data/create-store.data.ts
'use server'

export async function createStore(data: CreateStoreInput): Promise<Store>
```
- INSERT en Store table
- Generar slug automático desde name
- Validar subdomain único

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP01-STORE-010**
**Título:** Crear action para crear tienda
**Descripción:** 
```typescript
// features/stores/actions/create-store.action.ts
'use server'

export async function createStoreAction(data: CreateStoreInput): Promise<ServerResponse<Store>>
```
- Validar auth
- Validar límite de tiendas según plan (Free: 2)
- Llamar a data function
- Logging
- Revalidar path /stores

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-STORE-009, INFRA-BE-002, MVP01-AUTH-005

---

#### **MVP01-STORE-011**
**Título:** Crear access function para validar límite de tiendas
**Descripción:** 
```typescript
// features/stores/access/validate-store-limit.access.ts
'use server'

export async function validateStoreLimit(userId: string): Promise<ServerResponse<boolean>>
```
- Obtener plan del usuario
- Count actual de tiendas
- Comparar con límite del plan

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, Access  
**Dependencias:** INFRA-DB-017, INFRA-DB-004

---

#### **MVP01-STORE-012**
**Título:** Crear página de detalles de tienda
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]`
- Tabs: Overview, Products, Orders, Branches, Settings
- Breadcrumbs de navegación

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-DASH-001, INFRA-FE-002

---

#### **MVP01-STORE-013**
**Título:** Crear data function para obtener tienda por ID
**Descripción:** 
```typescript
// features/stores/data/get-store-by-id.data.ts
'use server'

export async function getStoreById(storeId: string): Promise<Store | null>
```

**Prioridad:** 🟠 P1  
**Complejidad:** XS  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP01-STORE-014**
**Título:** Crear action para obtener tienda por ID
**Descripción:** 
```typescript
// features/stores/actions/get-store.action.ts
'use server'

export async function getStoreAction(storeId: string): Promise<ServerResponse<Store>>
```
- Validar auth
- Validar que user es owner o employee
- Llamar a data function

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP01-STORE-013, INFRA-BE-002

---

#### **MVP01-STORE-015**
**Título:** Crear access function para validar ownership/employee de tienda
**Descripción:** 
```typescript
// features/stores/access/validate-store-access.access.ts
'use server'

export async function validateStoreAccess(
  userId: string,
  storeId: string
): Promise<ServerResponse<{ isOwner: boolean; isEmployee: boolean }>>
```
- Check si es owner
- Check si es employee
- Return objeto con ambos flags

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Access  
**Dependencias:** INFRA-DB-004, INFRA-DB-016

---

#### **MVP01-STORE-016**
**Título:** Crear página/modal para editar tienda
**Descripción:** 
- Form con: name (editable), subdomain (readonly después de crear), is_active
- Solo owner puede editar

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP01-STORE-017**
**Título:** Crear schema de validación para update tienda
**Descripción:** 
```typescript
// features/stores/schemas/update-store.schema.ts
export const updateStoreSchema = z.object({
  name: z.string().min(2).max(50),
  is_active: z.boolean()
})
```

**Prioridad:** 🟡 P2  
**Complejidad:** XS  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP01-STORE-018**
**Título:** Crear data function para actualizar tienda
**Descripción:** 
```typescript
// features/stores/data/update-store.data.ts
'use server'

export async function updateStore(
  storeId: string,
  data: UpdateStoreInput
): Promise<Store>
```
- UPDATE en Store table
- Actualizar slug si name cambia

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP01-STORE-019**
**Título:** Crear action para actualizar tienda
**Descripción:** 
```typescript
// features/stores/actions/update-store.action.ts
'use server'

export async function updateStoreAction(
  storeId: string,
  data: UpdateStoreInput
): Promise<ServerResponse<Store>>
```
- Validar auth y ownership
- Llamar a data function
- Logging de cambios
- Revalidar paths

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-STORE-018, MVP01-STORE-015, INFRA-BE-002

---

#### **MVP01-STORE-020**
**Título:** Crear action para eliminar tienda
**Descripción:** 
```typescript
// features/stores/actions/delete-store.action.ts
'use server'

export async function deleteStoreAction(storeId: string): Promise<ServerResponse<void>>
```
- Validar auth y ownership
- Soft delete (is_active = false) o hard delete
- Manejar datos relacionados (cascade)
- Logging

**Prioridad:** 🟢 P3  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, MVP01-STORE-015

---

### 📦 Productos - CRUD Básico

#### **MVP01-PROD-001**
**Título:** Crear página de listado de productos
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/products`
- Table con productos
- Botón "Add Product"
- Columnas: Image, Name, SKU, Price, Status, Actions

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP01-PROD-002**
**Título:** Crear data function para listar productos de tienda
**Descripción:** 
```typescript
// features/products/data/list-store-products.data.ts
'use server'

export async function listStoreProducts(
  storeId: string,
  filters?: ProductFilters
): Promise<Product[]>
```
- WHERE store_id = ?
- Filtros opcionales: is_active, is_published, category_id
- Paginación

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-006, INFRA-BE-001

---

#### **MVP01-PROD-003**
**Título:** Crear action para listar productos de tienda
**Descripción:** 
```typescript
// features/products/actions/list-store-products.action.ts
'use server'

export async function listStoreProductsAction(
  storeId: string
): Promise<ServerResponse<Product[]>>
```
- Validar acceso a tienda
- Llamar a data function

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP01-PROD-002, MVP01-STORE-015, INFRA-BE-002

---

#### **MVP01-PROD-004**
**Título:** Crear página/modal para crear producto
**Descripción:** 
- Form con campos básicos: name, description, price, sku, category
- Sin variantes por ahora (MVP 0.2)
- Upload de imagen (placeholder)

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-PROD-001, INFRA-FE-002

---

#### **MVP01-PROD-005**
**Título:** Crear schema de validación para crear producto (básico)
**Descripción:** 
```typescript
// features/products/schemas/create-product.schema.ts
export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  sku: z.string().min(1),
  category_id: z.string().uuid().optional()
})
```

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP01-PROD-006**
**Título:** Crear data function para crear producto
**Descripción:** 
```typescript
// features/products/data/create-product.data.ts
'use server'

export async function createProduct(
  storeId: string,
  data: CreateProductInput
): Promise<Product>
```
- INSERT en Product table
- Defaults: is_active=true, is_published=false

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-006, INFRA-BE-001

---

#### **MVP01-PROD-007**
**Título:** Crear action para crear producto
**Descripción:** 
```typescript
// features/products/actions/create-product.action.ts
'use server'

export async function createProductAction(
  storeId: string,
  data: CreateProductInput
): Promise<ServerResponse<Product>>
```
- Validar acceso y permiso (create_products)
- Validar límite de productos según plan
- Llamar a data function
- Logging
- Revalidar

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-PROD-006, MVP01-STORE-015, INFRA-BE-002

---

#### **MVP01-PROD-008**
**Título:** Crear access function para validar límite de productos
**Descripción:** 
```typescript
// features/products/access/validate-product-limit.access.ts
'use server'

export async function validateProductLimit(
  userId: string,
  storeId: string
): Promise<ServerResponse<boolean>>
```
- Obtener plan del usuario
- Count productos actuales de la tienda
- Comparar con límite (Free: 500/tienda)

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Access  
**Dependencias:** INFRA-DB-017, INFRA-DB-006

---

---

## MVP 0.2: Productos + Stock + Branches

> **Objetivo:** Sistema completo de productos con variantes, gestión de stock multinivel y sucursales

### 📦 Productos con Variantes

#### **MVP02-PROD-001**
**Título:** Extender schema de producto para campos dinámicos
**Descripción:** 
- Ya está en INFRA-DB-006 pero verificar que incluya todos los campos
- colors[], textures[], fragrances[], flavors[], sizes[]
- Migración si es necesario

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** DB  
**Dependencias:** INFRA-DB-006

---

#### **MVP02-PROD-002**
**Título:** Crear componente VariantAttributeSelector
**Descripción:** 
- Input multi-select para arrays: colors, sizes, etc.
- Añadir/remover valores
- Preview de combinaciones que se generarán
- "Se crearán X variantes"

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-PROD-003**
**Título:** Crear utility para generar variantes automáticamente
**Descripción:** 
```typescript
// features/products/utils/generate-variants.ts
export function generateVariants(attributes: ProductAttributes): VariantCombination[]
```
- Cartesian product de todos los arrays
- Generar SKU derivados
- Retornar array de combinaciones

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** Ninguna

---

#### **MVP02-PROD-004**
**Título:** Actualizar schema de create product con variantes
**Descripción:** 
```typescript
export const createProductSchemaWithVariants = createProductSchema.extend({
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  textures: z.array(z.string()).optional(),
  // ... otros
})
```

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Validation  
**Dependencias:** MVP01-PROD-005

---

#### **MVP02-PROD-005**
**Título:** Actualizar CreateProductForm con sección de variantes
**Descripción:** 
- Tabs: "Basic Info", "Variants", "Images"
- En tab Variants mostrar VariantAttributeSelector
- Preview de variantes a crear

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-PROD-004, MVP02-PROD-002

---

#### **MVP02-PROD-006**
**Título:** Crear data function para crear variantes en bulk
**Descripción:** 
```typescript
// features/products/data/create-product-variants.data.ts
'use server'

export async function createProductVariants(
  productId: string,
  variants: VariantInput[]
): Promise<ProductVariant[]>
```
- INSERT múltiple en ProductVariant table
- Transaction para atomicidad

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-007, INFRA-BE-001

---

#### **MVP02-PROD-007**
**Título:** Actualizar action de create product para incluir variantes
**Descripción:** 
- Modificar createProductAction
- Tras crear producto, si hay atributos de variantes:
  - Generar variantes con utility
  - Llamar a createProductVariants
  - Crear stock inicial para cada variante

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Backend  
**Dependencias:** MVP01-PROD-007, MVP02-PROD-003, MVP02-PROD-006

---

#### **MVP02-PROD-008**
**Título:** Crear componente VariantList para mostrar variantes
**Descripción:** 
- Table con columnas: Attributes, SKU, Price, Stock, Actions
- Editar precio override por variante
- Ver stock por sucursal

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-PROD-009**
**Título:** Crear data function para listar variantes de producto
**Descripción:** 
```typescript
// features/products/data/list-product-variants.data.ts
'use server'

export async function listProductVariants(productId: string): Promise<ProductVariant[]>
```

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-007, INFRA-BE-001

---

#### **MVP02-PROD-010**
**Título:** Crear action para listar variantes de producto
**Descripción:** 
```typescript
// features/products/actions/list-product-variants.action.ts
```
- Validar acceso a tienda del producto

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP02-PROD-009, INFRA-BE-002

---

### 🏢 Sucursales (Branches)

#### **MVP02-BRANCH-001**
**Título:** Crear página de gestión de sucursales
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/branches`
- List de branches
- Botón "Add Branch"
- Mostrar: name, location, stock info

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP02-BRANCH-002**
**Título:** Crear data function para listar branches de tienda
**Descripción:** 
```typescript
// features/branches/data/list-store-branches.data.ts
'use server'

export async function listStoreBranches(storeId: string): Promise<Branch[]>
```

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-005, INFRA-BE-001

---

#### **MVP02-BRANCH-003**
**Título:** Crear action para listar branches
**Descripción:** 
```typescript
// features/branches/actions/list-store-branches.action.ts
```
- Validar acceso a tienda

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP02-BRANCH-002, MVP01-STORE-015

---

#### **MVP02-BRANCH-004**
**Título:** Crear modal/form para crear branch
**Descripción:** 
- Form con: name, location, stock_distribution_enabled
- Validación

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-BRANCH-005**
**Título:** Crear schema de validación para branch
**Descripción:** 
```typescript
// features/branches/schemas/create-branch.schema.ts
export const createBranchSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  stock_distribution_enabled: z.boolean().default(true)
})
```

**Prioridad:** 🟠 P1  
**Complejidad:** XS  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP02-BRANCH-006**
**Título:** Crear data function para crear branch
**Descripción:** 
```typescript
// features/branches/data/create-branch.data.ts
'use server'

export async function createBranch(
  storeId: string,
  data: CreateBranchInput
): Promise<Branch>
```

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-005, INFRA-BE-001

---

#### **MVP02-BRANCH-007**
**Título:** Crear action para crear branch
**Descripción:** 
```typescript
// features/branches/actions/create-branch.action.ts
```
- Validar acceso y ownership
- Validar límite según plan (Free: 1, Pro: 5)
- Llamar a data function

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP02-BRANCH-006, MVP01-STORE-015

---

#### **MVP02-BRANCH-008**
**Título:** Crear access function para validar límite de branches
**Descripción:** 
```typescript
// features/branches/access/validate-branch-limit.access.ts
```
- Count actual de branches de la tienda
- Comparar con límite del plan

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend, Access  
**Dependencias:** INFRA-DB-005, INFRA-DB-017

---

### 📊 Gestión de Stock

#### **MVP02-STOCK-001**
**Título:** Crear página de gestión de stock
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/stock`
- Table con productos/variantes
- Columnas por cada branch
- Filtros: product, branch, low stock

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP02-STOCK-002**
**Título:** Crear data function para obtener stock por branch
**Descripción:** 
```typescript
// features/stock/data/get-stock-by-branch.data.ts
'use server'

export async function getStockByBranch(
  branchId: string,
  productId?: string,
  variantId?: string
): Promise<Stock[]>
```

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-009, INFRA-BE-001

---

#### **MVP02-STOCK-003**
**Título:** Crear data function para obtener stock de tienda (todas las branches)
**Descripción:** 
```typescript
// features/stock/data/get-store-stock.data.ts
'use server'

export async function getStoreStock(storeId: string): Promise<StockView[]>
```
- JOIN de Stock, Branch, Product, ProductVariant
- Retornar vista consolidada

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-009, INFRA-BE-001

---

#### **MVP02-STOCK-004**
**Título:** Crear action para obtener stock de tienda
**Descripción:** 
```typescript
// features/stock/actions/get-store-stock.action.ts
```
- Validar acceso a tienda
- Llamar a data function

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP02-STOCK-003, MVP01-STORE-015

---

#### **MVP02-STOCK-005**
**Título:** Crear modal para agregar stock
**Descripción:** 
- Form: product/variant selector, branch selector, quantity
- Validación: quantity > 0

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-STOCK-006**
**Título:** Crear schema de validación para agregar stock
**Descripción:** 
```typescript
// features/stock/schemas/add-stock.schema.ts
export const addStockSchema = z.object({
  branch_id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().int().positive()
}).refine(data => data.product_id || data.variant_id, {
  message: "Either product_id or variant_id must be provided"
})
```

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP02-STOCK-007**
**Título:** Crear data function para agregar stock
**Descripción:** 
```typescript
// features/stock/data/add-stock.data.ts
'use server'

export async function addStock(data: AddStockInput): Promise<Stock>
```
- UPSERT en Stock table
- Si existe, incrementar quantity
- Si no existe, INSERT

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencies:** INFRA-DB-009, INFRA-BE-001

---

#### **MVP02-STOCK-008**
**Título:** Crear action para agregar stock
**Descripción:** 
```typescript
// features/stock/actions/add-stock.action.ts
```
- Validar acceso a tienda y permiso (manage_stock)
- Llamar a data function
- Logging
- Revalidar paths

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP02-STOCK-007, MVP01-STORE-015, INFRA-BE-007

---

#### **MVP02-STOCK-009**
**Título:** Crear modal para transferir stock entre branches
**Descripción:** 
- Form: product/variant, from_branch, to_branch, quantity
- Validación: stock disponible en from_branch

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-STOCK-010**
**Título:** Crear schema de validación para transferir stock
**Descripción:** 
```typescript
// features/stock/schemas/transfer-stock.schema.ts
export const transferStockSchema = z.object({
  from_branch_id: z.string().uuid(),
  to_branch_id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().int().positive()
}).refine(data => data.from_branch_id !== data.to_branch_id, {
  message: "Cannot transfer to same branch"
})
```

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP02-STOCK-011**
**Título:** Crear data function para transferir stock
**Descripción:** 
```typescript
// features/stock/data/transfer-stock.data.ts
'use server'

export async function transferStock(data: TransferStockInput): Promise<void>
```
- Transaction:
  1. Verificar stock disponible en from_branch
  2. Decrementar stock en from_branch
  3. Incrementar stock en to_branch
- Rollback si falla

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-009, INFRA-BE-001

---

#### **MVP02-STOCK-012**
**Título:** Crear action para transferir stock
**Descripción:** 
```typescript
// features/stock/actions/transfer-stock.action.ts
```
- Validar acceso y permiso
- Llamar a data function
- Logging detallado de transferencia
- Revalidar

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP02-STOCK-011, MVP01-STORE-015, INFRA-BE-007

---

### 🖼️ Imágenes de Productos

#### **MVP02-IMG-001**
**Título:** Crear componente ImageUpload
**Descripción:** 
- Drag & drop o click to upload
- Preview de imágenes
- Progress bar
- Validación: formato (JPG, PNG, WEBP), tamaño (max 5MB)
- Límite: 5 imágenes por producto

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP02-IMG-002**
**Título:** Crear utility para upload a Supabase Storage
**Descripción:** 
```typescript
// features/products/utils/upload-product-image.ts
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string>
```
- Upload a bucket `product-images`
- Generar nombre único
- Retornar URL pública

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Integration  
**Dependencias:** INFRA-DEVOPS-005, INFRA-BE-004

---

#### **MVP02-IMG-003**
**Título:** Crear action para upload de imagen
**Descripción:** 
```typescript
// features/products/actions/upload-product-image.action.ts
'use server'

export async function uploadProductImageAction(
  formData: FormData,
  productId: string
): Promise<ServerResponse<string>>
```
- Validar file
- Validar límite de imágenes (5)
- Upload
- Actualizar pictures[] en Product

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP02-IMG-002, MVP01-STORE-015

---

#### **MVP02-IMG-004**
**Título:** Integrar ImageUpload en CreateProductForm
**Descripción:** 
- Tab "Images" en form
- Drag & drop de múltiples imágenes
- Designar main_picture
- Ordenar imágenes (drag to reorder)

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP02-IMG-001, MVP02-PROD-005

---

#### **MVP02-IMG-005**
**Título:** Crear action para eliminar imagen de producto
**Descripción:** 
```typescript
// features/products/actions/delete-product-image.action.ts
```
- Eliminar de Supabase Storage
- Actualizar pictures[] en Product
- Si era main_picture, setear otro como main

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Backend  
**Dependencias:** MVP01-STORE-015, INFRA-BE-004

---

### 📋 Categorías

#### **MVP02-CAT-001**
**Título:** Crear página de gestión de categorías
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/categories`
- Simple list
- Botón "Add Category"
- Edit/Delete inline

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP02-CAT-002**
**Título:** Crear data function para listar categorías de tienda
**Descripción:** 
```typescript
// features/categories/data/list-store-categories.data.ts
'use server'

export async function listStoreCategories(storeId: string): Promise<Category[]>
```

**Prioridad:** 🟡 P2  
**Complejidad:** XS  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-008, INFRA-BE-001

---

#### **MVP02-CAT-003**
**Título:** Crear action para listar categorías
**Descripción:** 
```typescript
// features/categories/actions/list-store-categories.action.ts
```

**Prioridad:** 🟡 P2  
**Complejidad:** XS  
**Stack:** Backend  
**Dependencias:** MVP02-CAT-002, MVP01-STORE-015

---

#### **MVP02-CAT-004**
**Título:** Crear schema, data y action para crear categoría
**Descripción:** 
- Schema: name, slug auto-generado
- Data function: INSERT en Category
- Action: validar acceso, llamar data function

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend, DB, Validation  
**Dependencias:** INFRA-DB-008

---

#### **MVP02-CAT-005**
**Título:** Crear schema, data y action para update/delete categoría
**Descripción:** 
- Schemas para update y delete
- Data functions correspondientes
- Actions con validación

**Prioridad:** 🟢 P3  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** MVP02-CAT-004

---

## MVP 0.3: Tienda Pública y Pedidos

> **Objetivo:** Catálogo público en subdominios, carrito de compras y flujo de pedidos

### 🌐 Tienda Pública

#### **MVP03-PUBLIC-001**
**Título:** Crear layout para tienda pública
**Descripción:** 
- Ruta: `/[locale]/s/[subdomain]/*` o mediante middleware de subdomain
- Header con logo de tienda, nombre, search
- Footer con links básicos
- Sin sidebar (diferente a dashboard)

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-BE-006, INFRA-FE-002

---

#### **MVP03-PUBLIC-002**
**Título:** Crear página home de tienda pública
**Descripción:** 
- Hero section con banner de tienda
- Grid de productos destacados (is_featured=true)
- Grid de productos recientes
- Categorías

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001

---

#### **MVP03-PUBLIC-003**
**Título:** Crear data function para obtener tienda por subdomain
**Descripción:** 
```typescript
// features/subdomain/data/get-store-by-subdomain.data.ts
'use server'

export async function getStoreBySubdomain(subdomain: string): Promise<Store | null>
```

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-004, INFRA-BE-001

---

#### **MVP03-PUBLIC-004**
**Título:** Crear action para obtener tienda por subdomain
**Descripción:** 
```typescript
// features/subdomain/actions/get-store-by-subdomain.action.ts
```
- No requiere auth
- Verificar is_active=true

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP03-PUBLIC-003

---

#### **MVP03-PUBLIC-005**
**Título:** Crear data function para listar productos públicos de tienda
**Descripción:** 
```typescript
// features/store-landing/data/list-public-products.data.ts
'use server'

export async function listPublicProducts(
  storeId: string,
  filters?: PublicProductFilters
): Promise<Product[]>
```
- WHERE is_published=true AND is_active=true
- Paginación
- Filtros: category, price range, search
- Ordenamiento: price, name, created_at, likes

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-006, INFRA-BE-001

---

#### **MVP03-PUBLIC-006**
**Título:** Crear action para listar productos públicos
**Descripción:** 
```typescript
// features/store-landing/actions/list-public-products.action.ts
```
- No requiere auth
- Cache agresivo (ISR)

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP03-PUBLIC-005

---

#### **MVP03-PUBLIC-007**
**Título:** Crear componente ProductCard público
**Descripción:** 
- Imagen principal
- Nombre, precio
- Badge si is_featured
- Contador de likes
- Botón "Ver detalles"
- Hover effects

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP03-PUBLIC-008**
**Título:** Crear componente ProductGrid
**Descripción:** 
- Responsive grid (1 col mobile, 2-4 cols desktop)
- Skeleton loading
- Empty state
- Load more / pagination

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-007

---

#### **MVP03-PUBLIC-009**
**Título:** Crear página de detalle de producto público
**Descripción:** 
- Ruta: `/[locale]/s/[subdomain]/products/[productId]`
- Gallery de imágenes
- Info del producto: name, description, price
- Selector de variantes (si aplica)
- Selector de cantidad
- Botón "Add to Cart"
- Sección de likes y comentarios

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001

---

#### **MVP03-PUBLIC-010**
**Título:** Crear data function para obtener producto público por ID
**Descripción:** 
```typescript
// features/store-landing/data/get-public-product.data.ts
'use server'

export async function getPublicProduct(productId: string): Promise<Product | null>
```
- Include variants
- Include likes count
- Include comments

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-006, INFRA-DB-013, INFRA-DB-014

---

#### **MVP03-PUBLIC-011**
**Título:** Crear componente ProductGallery
**Descripción:** 
- Main image grande
- Thumbnails debajo/al lado
- Zoom on hover
- Navigation entre imágenes

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP03-PUBLIC-012**
**Título:** Crear componente VariantSelector
**Descripción:** 
- Por cada atributo (color, size), mostrar selector
- Highlight variante seleccionada
- Deshabilitar combinaciones sin stock
- Actualizar SKU y precio según selección

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP03-PUBLIC-013**
**Título:** Crear searchbar para productos públicos
**Descripción:** 
- Input con search icon
- Debounced search
- Resultados en dropdown o página dedicada

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001

---

#### **MVP03-PUBLIC-014**
**Título:** Crear filtros para productos públicos
**Descripción:** 
- Sidebar con filtros:
  - Categorías (checkbox)
  - Rango de precio (slider)
  - Atributos dinámicos (colors, sizes)
- Apply filters button
- Clear all

**Prioridad:** 🟡 P2  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001

---

### 🛒 Carrito de Compras

#### **MVP03-CART-001**
**Título:** Crear context/state para carrito
**Descripción:** 
```typescript
// features/cart/context/cart-context.tsx
type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```
- Persistir en localStorage
- Client-side state management

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend  
**Dependencias:** Ninguna

---

#### **MVP03-CART-002**
**Título:** Crear componente CartIcon con badge
**Descripción:** 
- Icon de carrito en header
- Badge con count de items
- Click abre cart drawer/modal

**Prioridad:** 🔴 P0  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-CART-001, INFRA-FE-002

---

#### **MVP03-CART-003**
**Título:** Crear componente CartDrawer/Modal
**Descripción:** 
- Drawer desde el lado derecho (o modal)
- Lista de items en carrito
- Cada item: imagen, nombre, variante, precio, cantidad
- Botones +/- para cantidad
- Botón remove
- Total
- Botón "Checkout"

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-CART-001, INFRA-FE-002

---

#### **MVP03-CART-004**
**Título:** Integrar "Add to Cart" en ProductCard y detalle
**Descripción:** 
- En ProductCard: botón rápido "Add to Cart"
- En detalle: selector de cantidad + variante + "Add to Cart"
- Toast de confirmación
- Actualizar badge de carrito

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Frontend  
**Dependencias:** MVP03-PUBLIC-007, MVP03-PUBLIC-009, MVP03-CART-001

---

### 📝 Checkout y Pedidos

#### **MVP03-CHECKOUT-001**
**Título:** Crear página de checkout
**Descripción:** 
- Ruta: `/[locale]/s/[subdomain]/checkout`
- Proteger con auth (redirect a login si no está logueado)
- Steps: Cart Review, Delivery Info, Confirmation
- Resumen del pedido
- Form de delivery

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001, MVP01-AUTH-005

---

#### **MVP03-CHECKOUT-002**
**Título:** Crear componente CheckoutSteps
**Descripción:** 
- Stepper con 3 pasos
- Highlight paso actual
- Navegación entre pasos

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

#### **MVP03-CHECKOUT-003**
**Título:** Crear schema de validación para checkout
**Descripción:** 
```typescript
// features/checkout/schemas/checkout.schema.ts
export const checkoutSchema = z.object({
  delivery_method: z.enum(['pickup', 'shipping']),
  branch_id: z.string().uuid(), // si pickup
  shipping_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string()
  }).optional(), // si shipping
  shipping_courier: z.string().optional(),
  notes: z.string().max(500).optional()
})
```

**Prioridad:** 🔴 P0  
**Complejidad:** M  
**Stack:** Validation  
**Dependencias:** Ninguna

---

#### **MVP03-CHECKOUT-004**
**Título:** Crear componente CheckoutForm
**Descripción:** 
- Tab/toggle: Pickup vs Shipping
- Si Pickup: selector de branch
- Si Shipping: form de dirección completa
- Field para notas adicionales
- Summary con total

**Prioridad:** 🔴 P0  
**Complejidad:** L  
**Stack:** Frontend, UI, Validation  
**Dependencias:** MVP03-CHECKOUT-001, MVP03-CHECKOUT-003

---

#### **MVP03-CHECKOUT-005**
**Título:** Crear data function para crear order
**Descripción:** 
```typescript
// features/checkout/data/create-order.data.ts
'use server'

export async function createOrder(data: CreateOrderInput): Promise<Order>
```
- Transaction:
  1. INSERT en Order
  2. INSERT múltiple en OrderItem
  3. Decrementar stock de branch
- Rollback si falla

**Prioridad:** 🔴 P0  
**Complejidad:** XL  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-010, INFRA-DB-011, INFRA-DB-009

---

#### **MVP03-CHECKOUT-006**
**Título:** Crear action para crear order
**Descripción:** 
```typescript
// features/checkout/actions/create-order.action.ts
'use server'

export async function createOrderAction(data: CreateOrderInput): Promise<ServerResponse<Order>>
```
- Validar usuario autenticado
- Validar stock disponible antes de crear
- Llamar a data function
- Enviar email al customer (confirmación)
- Enviar email al owner (nuevo pedido)
- Logging

**Prioridad:** 🔴 P0  
**Complejidad:** XL  
**Stack:** Backend  
**Dependencias:** MVP03-CHECKOUT-005, MVP01-AUTH-005, INFRA-BE-002

---

#### **MVP03-CHECKOUT-007**
**Título:** Crear página de confirmación de pedido
**Descripción:** 
- Ruta: `/[locale]/s/[subdomain]/orders/[orderId]/confirmation`
- Mensaje de éxito
- Resumen del pedido
- Número de orden
- Instrucciones siguientes pasos
- Link para ver pedido

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Frontend, UI  
**Dependencias:** MVP03-PUBLIC-001

---

### 📋 Gestión de Pedidos (Dashboard)

#### **MVP03-ORDER-001**
**Título:** Crear página de listado de pedidos en dashboard
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/orders`
- Table con pedidos
- Columnas: Order#, Customer, Date, Total, Status, Actions
- Filtros: status, date range
- Paginación

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012, INFRA-FE-002

---

#### **MVP03-ORDER-002**
**Título:** Crear data function para listar órdenes de tienda
**Descripción:** 
```typescript
// features/orders/data/list-store-orders.data.ts
'use server'

export async function listStoreOrders(
  storeId: string,
  filters?: OrderFilters
): Promise<Order[]>
```
- Include customer info
- Include items
- Filtros: status, date range
- Paginación

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-010, INFRA-DB-011

---

#### **MVP03-ORDER-003**
**Título:** Crear action para listar órdenes de tienda
**Descripción:** 
```typescript
// features/orders/actions/list-store-orders.action.ts
```
- Validar acceso y permiso (view_orders)

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP03-ORDER-002, MVP01-STORE-015, INFRA-BE-007

---

#### **MVP03-ORDER-004**
**Título:** Crear página de detalle de orden
**Descripción:** 
- Ruta: `/[locale]/dashboard/stores/[storeId]/orders/[orderId]`
- Info completa del pedido
- Customer info
- Items con imágenes
- Status timeline
- Delivery info
- Actions: cambiar status, agregar tracking, cancelar

**Prioridad:** 🟠 P1  
**Complejidad:** L  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-STORE-012

---

#### **MVP03-ORDER-005**
**Título:** Crear data function para obtener orden por ID
**Descripción:** 
```typescript
// features/orders/data/get-order-by-id.data.ts
'use server'

export async function getOrderById(orderId: string): Promise<Order | null>
```
- Include all relations: customer, items, products

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-010, INFRA-DB-011

---

#### **MVP03-ORDER-006**
**Título:** Crear action para obtener orden por ID
**Descripción:** 
```typescript
// features/orders/actions/get-order.action.ts
```
- Validar acceso a tienda del orden

**Prioridad:** 🟠 P1  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP03-ORDER-005, MVP01-STORE-015

---

#### **MVP03-ORDER-007**
**Título:** Crear schema y action para actualizar status de orden
**Descripción:** 
```typescript
// features/orders/schemas/update-order-status.schema.ts
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_transit', 'ready_pickup', 'delivered', 'cancelled'])
})

// features/orders/actions/update-order-status.action.ts
```
- Validaciones de transiciones válidas
- Logging de cambios
- Notificar a customer

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Validation  
**Dependencias:** MVP03-ORDER-005, MVP01-STORE-015

---

#### **MVP03-ORDER-008**
**Título:** Crear schema y action para agregar tracking info
**Descripción:** 
```typescript
// features/orders/schemas/add-tracking.schema.ts
export const addTrackingSchema = z.object({
  shipping_courier: z.string().min(1),
  shipping_tracking_number: z.string().min(1),
  shipping_tracking_url: z.string().url().optional()
})

// features/orders/actions/add-tracking.action.ts
```
- Actualizar campos en Order
- Cambiar status a in_transit
- Notificar a customer

**Prioridad:** 🟠 P1  
**Complejidad:** M  
**Stack:** Backend, Validation  
**Dependencias:** MVP03-ORDER-005

---

#### **MVP03-ORDER-009**
**Título:** Crear action para cancelar orden
**Descripción:** 
```typescript
// features/orders/actions/cancel-order.action.ts
```
- Cambiar status a cancelled
- Devolver stock a branch
- Logging
- Notificar a customer

**Prioridad:** 🟡 P2  
**Complejidad:** L  
**Stack:** Backend, DB  
**Dependencias:** MVP03-ORDER-005, INFRA-DB-009

---

#### **MVP03-ORDER-010**
**Título:** Crear componente OrderStatusBadge
**Descripción:** 
- Badge con color según status
- Iconos apropiados
- Tooltip con info

**Prioridad:** 🟡 P2  
**Complejidad:** XS  
**Stack:** Frontend, UI  
**Dependencias:** INFRA-FE-002

---

### 👤 Mis Pedidos (Customer View)

#### **MVP03-MYORDERS-001**
**Título:** Crear página "Mis Pedidos" para customers
**Descripción:** 
- Ruta: `/[locale]/account/orders` o `/[locale]/my-orders`
- Lista de pedidos del usuario
- Filtros: store, status, date
- Solo pedidos donde user es customer

**Prioridad:** 🟡 P2  
**Complejidad:** M  
**Stack:** Frontend, UI  
**Dependencias:** MVP01-DASH-001

---

#### **MVP03-MYORDERS-002**
**Título:** Crear data function para listar pedidos de customer
**Descripción:** 
```typescript
// features/store-orders/data/list-customer-orders.data.ts
'use server'

export async function listCustomerOrders(customerId: string): Promise<Order[]>
```

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend, DB  
**Dependencias:** INFRA-DB-010

---

#### **MVP03-MYORDERS-003**
**Título:** Crear action para listar pedidos de customer
**Descripción:** 
```typescript
// features/store-orders/actions/list-customer-orders.action.ts
```
- Validar auth
- Solo retornar pedidos del usuario autenticado

**Prioridad:** 🟡 P2  
**Complejidad:** S  
**Stack:** Backend  
**Dependencias:** MVP03-MYORDERS-002, MVP01-AUTH-005

---

## Resumen de Tareas por Fase

### FASE 0: Infraestructura (45 tareas)
- Database: 20 tareas
- Backend: 7 tareas
- Frontend: 7 tareas
- Testing: 3 tareas
- DevOps: 5 tareas
- Docs: 3 tareas

### MVP 0.1: Auth + Dashboard + Store Base (45 tareas completadas arriba)
- Auth: 18 tareas
- Dashboard: 6 tareas
- Stores: 20 tareas
- Products (básico): 8 tareas

### MVP 0.2: Productos + Stock + Branches (pendiente ~60 tareas)
### MVP 0.3: Tienda Pública + Pedidos (pendiente ~50 tareas)
### MVP 0.4: Onboarding + Tutorial (pendiente ~20 tareas)
### MVP 0.5: Social Features (pendiente ~35 tareas)
### MVP 0.6: Empleados (pendiente ~40 tareas)
### v1.0: Planes + Mercado Pago (pendiente ~30 tareas)

**Total estimado: ~325 tareas granulares**

---

