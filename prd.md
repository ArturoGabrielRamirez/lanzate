# 🧾 Product Requirements Document (PRD)

**Proyecto:** Tienda dinámica multi-sucursal (SaaS B2C)  
**Versión:** MVP v0.1  
**Stack:** Next.js (App Router) + Supabase + Prisma + Tailwind + Shadcn UI + GSAP  
**Modelo:** SaaS multi-tenant

---

## 📑 Tabla de Contenidos

1. [Visión del producto](#-1-visión-del-producto)
2. [Tipos de usuario](#-2-tipos-de-usuario)
3. [Estructura general del sistema](#️-3-estructura-general-del-sistema)
4. [Onboarding y tutorial](#-4-onboarding-y-tutorial)
5. [Tiendas y sucursales](#-5-tiendas-y-sucursales)
6. [Productos y categorías](#-6-productos-y-categorías)
7. [Stock, pedidos y envíos](#-7-stock-pedidos-y-envíos)
8. [Planes SaaS](#-8-planes-saas-mvp)
9. [Arquitectura técnica](#️-9-arquitectura-técnica)
10. [Interacciones sociales y feed](#-10-interacciones-sociales-y-feed)
11. [Roadmap MVP → v1.0](#-11-roadmap-mvp--v10)
12. [Criterios de aceptación](#-12-criterios-de-aceptación-mvp)
13. [Consideraciones adicionales](#-13-consideraciones-adicionales)
14. [Decisiones de negocio](#-decisiones-de-negocio-y-técnicas)

---

## 🎯 1. Visión del producto

Una plataforma web SaaS que permite a tiendas físicas o digitales gestionar su inventario, sucursales y ventas, con la posibilidad de ofrecer un catálogo público bajo un subdominio personalizado.

Cada usuario puede crear su propia tienda y, al mismo tiempo, comprar en tiendas de otros usuarios.

### Objetivo del MVP

Entregar una base sólida que combine:

- ✅ Onboarding rápido
- ✅ Gestión centralizada de productos y stock
- ✅ Publicación de catálogos públicos con pedidos
- ✅ Escalabilidad para futuros planes pagos y módulos adicionales (POS, reportes, analíticas, etc.)

---

## 👤 2. Tipos de usuario

| Rol | Descripción | Permisos principales |
|-----|-------------|---------------------|
| **Owner** | Creador de la tienda | CRUD completo de tienda, sucursales, productos, empleados y configuración |
| **Empleado** | Usuario invitado por un owner | Permisos granulares configurables (ej: solo stock, solo pedidos, etc.) |
| **Cliente** | Cualquier usuario registrado | Puede navegar tiendas públicas, crear pedidos, interactuar con productos |

> 💡 **Nota:** Cualquier usuario, sin importar su rol, puede actuar como cliente en otras tiendas.

### 2.1 Sistema de Empleados

**Flujo de invitación:**
1. Owner envía invitación con email a un usuario existente o nuevo
2. Usuario recibe notificación (email + in-app)
3. Usuario revisa "contrato" (términos, permisos ofrecidos, tienda)
4. Usuario acepta/rechaza la invitación
5. Si acepta, pasa a tener rol de empleado en esa tienda

**Permisos granulares configurables:**
- ✅ Ver productos
- ✅ Crear/editar productos
- ✅ Eliminar productos
- ✅ Gestionar stock (agregar, transferir)
- ✅ Ver pedidos
- ✅ Confirmar/cancelar pedidos
- ✅ Gestionar sucursales
- ✅ Ver reportes/analytics

**Límites por plan:**
- Free: hasta **3 empleados** por tienda
- Pro: hasta **15 empleados** por tienda
- Enterprise: **ilimitado**

> ⚠️ **Importante:** Un usuario puede ser empleado en múltiples tiendas simultáneamente

---

## 🏗️ 3. Estructura general del sistema

### 3.1 Landing Page

- Presentación del producto SaaS
- Sección de precios (Free / Pro / Enterprise — placeholder)
- CTA principal: "Comenzar gratis" → signup

### 3.2 Auth Pages

- Login (email/password + Google OAuth)
- Signup
- Password reset

### 3.3 Dashboard (zona privada)

Estructura de rutas:

```
/dashboard
  ├── /home              → Resumen general, tutorial card si no completó onboarding
  ├── /stores            → Listado de tiendas + botón "Crear tienda"
  ├── /account           → Perfil, plan actual, cambio de contraseña
  ├── /employees         → Gestión de empleados (solo para owner)
  └── /[storeId]
      ├── /products      → CRUD productos
      ├── /categories    → Gestión de categorías
      ├── /orders        → Listado y gestión de pedidos
      └── /branches      → Gestión de sucursales y stock
```

---

## 🧭 4. Onboarding y tutorial

### Flujo inicial

1. Usuario crea cuenta → se redirige al dashboard
2. Si el usuario no tiene tiendas, se muestra un **popup modal de tutorial inicial** con pasos:
   - ✅ Crear primera tienda
   - ✅ Crear primer producto
   - ✅ Copiar y compartir subdominio público
3. Una vez completado, el tutorial se marca como "completo"
4. En el dashboard siempre existe una **card de "Tutorial"** que permite relanzar el recorrido

---

## 🏬 5. Tiendas y sucursales

### 5.1 Tienda (Store)

**Campos:**
```typescript
{
  id: string
  name: string
  slug: string
  subdomain: string (único)
  owner_id: string
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

**Características:**
- Cada tienda tiene un subdominio único: `https://{subdomain}.misitioprincipal.com`
- Una tienda puede tener múltiples branches (sucursales)
- El límite de tiendas depende del plan (Free: 2, Pro: 5, Enterprise: ∞)

### 5.2 Branch (Sucursal)

**Campos:**
```typescript
{
  id: string
  store_id: string
  name: string
  location: string
  stock_distribution_enabled: boolean
  created_at: timestamp
}
```

**Características:**
- Comparten el catálogo de la tienda pero cada una mantiene su propio stock
- Permiten transferencias de stock entre sucursales (solo owner o empleados con permisos)
- Límite según plan: Free (1), Pro (5), Enterprise (∞)

---

## 📦 6. Productos y categorías

### 6.1 Productos

#### Campos fijos:
```typescript
{
  id: string
  store_id: string
  name: string
  description: string
  price: decimal
  sku: string
  barcode: string
  main_picture: string
  pictures: string[]
  is_active: boolean
  is_published: boolean
  is_featured: boolean
}
```

#### Campos dinámicos predefinidos (opcionales):
```typescript
{
  // Dimensiones
  width?: number
  height?: number
  depth?: number
  circumference?: number
  
  // Atributos físicos
  weight?: number
  colors?: string[]
  textures?: string[]
  fragrances?: string[]
  flavors?: string[]
  
  // Otros
  expiration_date?: date
  sizes?: string[]
}
```

#### Variantes:
- **Generación automática en UI:** Al crear/editar un producto, el usuario puede agregar arrays de:
  - `colors[]`
  - `textures[]`
  - `fragrances[]`
  - `flavors[]`
  - `sizes[]` (talles)
  - Custom sizes (tamaños)
- El sistema **genera automáticamente** todas las combinaciones posibles  
  *Ejemplo:* 2 colores × 3 talles = **6 variantes**
- Cada variante:
  - Tiene su propio **stock por branch**
  - SKU derivado (ej: `PROD-001-RED-M`)
  - Precio puede heredar del producto padre o ser personalizado

### 6.2 Categorías

**Estructura:** Plana (por ahora)

**Campos:**
```typescript
{
  id: string
  store_id: string
  name: string
  slug: string
}
```

**Relación:** N:1 con productos (un producto pertenece a una categoría)

> 🔮 **Futuro:** categorías jerárquicas (padre/hijo)

---

## 🧮 7. Stock, pedidos y envíos

### 7.1 Gestión de Stock

- **Regla principal:** Cada variante/producto tiene stock **por branch**

#### Operaciones básicas:
```typescript
addStock(branchId: string, productId: string, amount: number)
transferStock(fromBranch: string, toBranch: string, productId: string, amount: number)
```

- Los pedidos afectan el stock del branch de origen

### 7.2 Pedidos (MVP)

**Flujo básico:** Sin pago online aún (payment gateway en v1.0)

**Campos:**
```typescript
{
  id: string
  store_id: string
  branch_id: string
  customer_id: string
  items: OrderItem[]
  total: decimal
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: timestamp
  updated_at: timestamp
}
```

**Estados:**
- `pending` → Pedido creado, esperando confirmación
- `confirmed` → Confirmado por el owner/empleado
- `in_transit` → En camino (solo si hay envío)
- `ready_pickup` → Listo para retirar en sucursal
- `delivered` → Entregado al cliente
- `cancelled` → Cancelado

**Relación con clientes:**
- ✅ El cliente **debe estar registrado** para crear pedidos
- ❌ No hay guest checkout en el MVP

### 7.3 Gestión de Envíos

**Métodos de entrega:**

1. **Pickup en sucursal** (por defecto)
   - Cliente retira en branch seleccionado
   - Estado: `ready_pickup` cuando está listo
   
2. **Envío con tracking manual**
   - Owner/empleado registra manualmente:
     - Courier utilizado (texto libre)
     - Número de tracking (texto libre)
     - URL de tracking (opcional)
   - Owner/empleado actualiza estado a `in_transit`
   - Owner/empleado marca como `delivered` al confirmar entrega

**Campos adicionales en Order:**
```typescript
{
  delivery_method: 'pickup' | 'shipping'
  
  // Solo si delivery_method = 'shipping'
  shipping_courier?: string
  shipping_tracking_number?: string
  shipping_tracking_url?: string
  shipping_address?: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}
```

> 🔮 **Futuro v1.0+:** Integración automática con couriers (Andreani, Correo Argentino, etc.)

---

## 💳 8. Planes SaaS (MVP)

| Plan | Límite tiendas | Límite productos | Sucursales | Empleados | Precio |
|------|----------------|------------------|------------|-----------|--------|
| **Free** | 2 | 500/tienda | 1/tienda | 3/tienda | $0 |
| **Pro** | 5 | 5,000/tienda | 5/tienda | 15/tienda | TBD (ARS) |
| **Enterprise** | ∞ | ∞ | ∞ | ∞ | TBD (ARS) |

**Notas importantes:**
- Límites de productos son **por tienda**, no totales
- **Método de pago:** Mercado Pago (integración en v1.0)
- **Moneda:** Pesos Argentinos (ARS)

> 💡 **Nota MVP:** Integración de pago no incluida en MVP, pero arquitectura preparada  
> (tabla `account_plan` + billing placeholders para v1.0)

---

## ⚙️ 9. Arquitectura técnica

### 9.1 Frontend

- **Next.js 15** (App Router)
- **Server Actions** para lógica de negocio
- **Tailwind CSS** + **Shadcn UI** para componentes
- **GSAP** para animaciones del onboarding y UI
- **Zustand** o **Context API** para manejo de estado temporal (ej. tutorial)

### 9.2 Backend / Database

- **Supabase** (PostgreSQL + Auth + Storage)
- **Prisma ORM** para queries type-safe
- **Auth con Supabase:**
  - Email/password
  - Google OAuth
- **Row-level security (RLS)** por `store_id`
- **Edge functions** para procesos pesados (ej: transferencia de stock)

### 9.3 Multitenancy (Subdominios)

**Enrutamiento por subdominio:**

```
app.misitioprincipal.com     → Dashboard (zona privada)
{store}.misitioprincipal.com → Tienda pública (catálogo)
```

- Cada request resuelve el **tenant** por el subdominio
- Middleware de Next.js identifica y valida el subdomain
- RLS en Supabase asegura aislamiento de datos

### 9.4 Sistema de Logs y Auditoría

**Objetivo:** Tracking completo de operaciones para debugging, seguridad y compliance

**Implementación:**
- Cada **action function** y **data function** debe registrar su ejecución en DB
- Tabla `activity_logs` centralizada

**Estructura del log:**
```typescript
ActivityLog {
  id: string
  user_id: string
  store_id?: string
  action_type: string  // ej: 'product.create', 'stock.transfer', 'order.confirm'
  entity_type: string  // ej: 'product', 'order', 'branch'
  entity_id: string
  
  // Metadata
  changes?: json       // before/after para updates
  metadata?: json      // datos adicionales contextuales
  ip_address?: string
  user_agent?: string
  
  // Status
  status: 'success' | 'error'
  error_message?: string
  
  // Timing
  duration_ms?: number
  created_at: timestamp
}
```

**Casos de uso:**
- Auditoría de cambios críticos
- Debugging de errores en producción
- Análisis de comportamiento de usuarios
- Compliance y seguridad

**Visualización:**
- Dashboard con historial de actividad reciente
- Filtros por: usuario, tienda, tipo de acción, fecha
- Exportación a CSV para análisis

> ⚠️ **Performance:** Logs se escriben de forma asíncrona para no bloquear operaciones

---

## 💬 10. Interacciones sociales y feed

### 10.1 Sistema de Likes y Comentarios

**Productos interactivos:**
- Cada producto puede recibir:
  - ✅ **Likes** de usuarios registrados
  - ✅ **Comentarios** de usuarios registrados

**Estructura de datos:**

```typescript
ProductLike {
  id: string
  product_id: string
  user_id: string
  created_at: timestamp
}

ProductComment {
  id: string
  product_id: string
  user_id: string
  comment: string
  created_at: timestamp
  updated_at: timestamp
}
```

**Reglas:**
- Un usuario solo puede dar 1 like por producto (unique constraint)
- Los comentarios se pueden editar/eliminar por el autor
- Owner de la tienda puede eliminar cualquier comentario en sus productos
- Los comentarios tienen límite de caracteres (ej: 500)

**Visualización en producto:**
- Contador de likes
- Botón de like (toggle)
- Lista de comentarios ordenados por fecha
- Formulario para nuevo comentario

### 10.2 Social Feed en Dashboard

**Objetivo:** Dashboard dinámico que muestre actividad reciente de la tienda

**Feed unificado que muestra:**
1. 🛒 **Nuevos pedidos recibidos**
   ```
   "Juan Pérez realizó un pedido por $2,500 - Hace 5 minutos"
   ```

2. ❤️ **Likes en productos**
   ```
   "María García le dio like a 'Remera Estampada' - Hace 15 minutos"
   ```

3. 💬 **Nuevos comentarios**
   ```
   "Carlos López comentó en 'Zapatillas Nike': 'Excelente calidad!' - Hace 1 hora"
   ```

**Estructura de datos:**

```typescript
FeedItem {
  id: string
  store_id: string
  type: 'order' | 'like' | 'comment'
  
  // Relaciones
  user_id: string           // quien realizó la acción
  product_id?: string       // si aplica
  order_id?: string         // si aplica
  comment_id?: string       // si aplica
  
  // Display
  message: string           // texto formateado para mostrar
  
  created_at: timestamp
}
```

**Características del feed:**
- ♾️ Scroll infinito (paginación)
- 🔄 Auto-refresh cada X segundos (polling o websockets)
- 🔔 Badge con conteo de items no vistos
- 🎨 Iconos y colores según tipo de actividad
- 🔗 Links directos a producto/pedido relacionado

**Implementación:**
- Trigger o función que crea `FeedItem` automáticamente cuando:
  - Se crea un pedido
  - Se da like a un producto
  - Se crea un comentario
- Cache en memoria para feed reciente (última hora)
- Limpieza periódica de items antiguos (>30 días)

> 🔮 **Futuro v1.0+:**
> - Notificaciones push para eventos importantes
> - Filtros por tipo de actividad
> - Analytics del feed (engagement, productos más populares)

---

## 🚀 11. Roadmap MVP → v1.0

| Fase | Hito | Entregable |
|------|------|-----------|
| **MVP 0.1** | Autenticación + Dashboard + Tienda base | Auth, crear tienda, crear producto |
| **MVP 0.2** | Productos + Stock + Branches | CRUD productos, stock por sucursal, variantes automáticas |
| **MVP 0.3** | Tienda pública y pedidos básicos | Catálogo público, flujo de pedido, gestión de envíos |
| **MVP 0.4** | Onboarding y tutorial UI | Popup inicial + card persistente |
| **MVP 0.5** | Social features | Likes, comentarios, social feed en dashboard |
| **MVP 0.6** | Sistema de empleados | Invitaciones, permisos granulares, gestión |
| **v1.0** | Planes pagos + Mercado Pago | Integración de pago, límites por plan, facturación |

---

## ✅ 12. Criterios de aceptación (MVP)

### Autenticación y Onboarding:
- [ ] El usuario puede registrarse y acceder al dashboard
- [ ] Si no tiene tiendas, se muestra el tutorial inicial
- [ ] El usuario puede volver a ver el tutorial desde el dashboard

### Tiendas y Productos:
- [ ] Puede crear hasta 2 tiendas con subdominio único
- [ ] Puede crear hasta 500 productos por tienda
- [ ] Los productos soportan variantes autogeneradas (colores, talles, etc.)
- [ ] Los productos se pueden marcar como publicados/no publicados/destacados
- [ ] Cada tienda tiene un catálogo público accesible por subdominio

### Stock y Sucursales:
- [ ] Cada tienda tiene una branch inicial automática
- [ ] Se puede transferir stock entre sucursales (cuando haya más de una)
- [ ] El stock se maneja por variante/producto y por branch

### Pedidos y Envíos:
- [ ] Solo usuarios registrados pueden crear pedidos
- [ ] Los pedidos soportan pickup en sucursal
- [ ] Los pedidos soportan envío con tracking manual
- [ ] Owner/empleados pueden cambiar estado de pedidos

### Empleados:
- [ ] Owner puede invitar hasta 3 empleados por tienda (plan Free)
- [ ] Los empleados reciben invitación y pueden aceptar/rechazar
- [ ] Se pueden configurar permisos granulares por empleado

### Social Features:
- [ ] Los usuarios pueden dar like a productos
- [ ] Los usuarios pueden comentar en productos
- [ ] El dashboard muestra un feed con: pedidos, likes y comentarios recientes

### Sistema de Logs:
- [ ] Todas las actions/data functions registran actividad en DB
- [ ] El dashboard muestra historial de actividad

---

## 🔍 13. Consideraciones adicionales

### 13.1 Imágenes y Storage

**Estrategia:**
- Uso de **Supabase Storage** para imágenes de productos, logos y banners
- Buckets por tipo: `product-images`, `store-logos`, `store-banners`
- Políticas RLS en buckets para controlar acceso
- Optimización automática de imágenes (resize, webp)

**Límites MVP:**
- Max 5 imágenes por producto
- Max 5MB por imagen
- Formatos: JPG, PNG, WEBP

### 13.2 Internacionalización (i18n)

**Soporte inicial:**
- Español (es) - idioma por defecto
- Inglés (en)

**Implementación:**
- `next-intl` para manejo de traducciones
- Rutas con prefijo de locale: `/es/dashboard`, `/en/dashboard`
- Detección automática de idioma del navegador

> 🔮 **Futuro:** Más idiomas según demanda de usuarios

### 13.3 SEO y Metadatos

**Landing page:**
- Meta tags optimizados (title, description, OG tags)
- Schema.org markup para productos
- Sitemap.xml generado automáticamente

**Tiendas públicas:**
- Meta tags dinámicos por tienda
- Open Graph para compartir en redes sociales
- Robots.txt personalizable por tienda

### 13.4 Notificaciones

**MVP (básico):**
- Emails transaccionales vía Supabase:
  - Confirmación de registro
  - Reset de password
  - Nuevos pedidos (owner)
  - Invitación de empleado

> 🔮 **Futuro v1.0:**
> - Notificaciones push
> - Webhooks para integraciones
> - Email marketing

### 13.5 Búsqueda y Filtros

**Catálogo público:**
- Búsqueda por nombre de producto
- Filtros por:
  - Categoría
  - Rango de precio
  - Atributos dinámicos (color, talla, etc.)
- Ordenamiento por: precio, nombre, fecha, popularidad (likes)

**Dashboard:**
- Búsqueda en listado de productos
- Filtros por categoría, estado (activo/inactivo, publicado)

### 13.6 Seguridad

**Medidas implementadas:**
- **Auth:** JWT tokens con refresh automático
- **RLS:** Row-level security en todas las tablas
- **CORS:** Configuración restrictiva
- **Rate limiting:** Por IP y por usuario
- **Validación:** Zod schemas en client y server
- **CSRF Protection:** Tokens en formularios

**Datos sensibles:**
- Variables de entorno para API keys
- No almacenar passwords en texto plano (Supabase Auth)
- Encriptación de datos sensibles en DB

### 13.7 Performance

**Optimizaciones:**
- **ISR (Incremental Static Regeneration)** para catálogos públicos
- **Server Components** por defecto
- **Code splitting** automático por ruta
- **Image optimization** con `next/image`
- **Font optimization** con `next/font`
- **Caching:** estrategias de revalidación por tipo de dato

**Targets MVP:**
- Lighthouse score > 90
- FCP < 1.5s
- LCP < 2.5s

### 13.8 Analytics y Monitoreo

**MVP (básico):**
- Google Analytics 4 para tracking básico
- Supabase Dashboard para monitoreo de DB
- Vercel Analytics para web vitals

> 🔮 **Futuro v1.0:**
> - Dashboard de analytics por tienda
> - Reportes de ventas
> - Métricas de conversión
> - Análisis de engagement (likes, comentarios)

### 13.9 Testing

**Estrategia:**
- **Unit tests:** Vitest para utils y funciones puras
- **Integration tests:** Testing Library para componentes
- **E2E tests:** Playwright para flujos críticos (auth, checkout)

**Cobertura mínima MVP:**
- 70% coverage en utils y actions
- E2E tests para: signup, login, crear tienda, crear producto, hacer pedido, likes/comentarios

### 13.10 Deployment

**Entorno de desarrollo:**
- Vercel Preview deployments por PR
- Supabase proyecto de staging

**Entorno de producción:**
- Vercel Production
- Supabase proyecto de producción
- Custom domain con SSL

**CI/CD:**
- GitHub Actions para:
  - Linting (ESLint)
  - Type checking (TypeScript)
  - Tests (Vitest + Playwright)
  - Build validation

### 13.11 Legal y Compliance

**Requerido para MVP:**
- [ ] Página de Términos y Condiciones
- [ ] Página de Política de Privacidad
- [ ] Cookie consent banner (GDPR)
- [ ] Aviso de tratamiento de datos personales

### 13.12 Soporte y Documentación

**Para usuarios:**
- Tutorial interactivo (onboarding)
- FAQ page
- Centro de ayuda básico

**Para desarrolladores:**
- README con setup instructions
- API documentation (cuando aplique)
- Architectural Decision Records (ADRs)

---

## 📌 Decisiones de negocio y técnicas

### Modelo de negocio confirmado:
1. **Monetización:** Suscripción mensual a la plataforma (SaaS puro)
2. **Método de pago v1.0:** Mercado Pago
3. **Público objetivo:** Latinoamérica - ciudades chicas/pueblos de Argentina
4. **Gestión de envíos:** 
   - Pickup en sucursal
   - Tracking manual del envío por parte del owner/empleado

### Decisiones técnicas pendientes:
- Dominio principal (TBD)
- Rate limiting específico (TBD post-MVP)
- Estrategia de backups (usar defaults de Supabase por ahora)

---

## 📝 Changelog

### v0.2 - 2025-10-05
- ✅ Formato markdown mejorado y completo
- ✅ Decisiones de negocio confirmadas (Mercado Pago, público objetivo Argentina)
- ✅ Sistema de empleados detallado (invitaciones, permisos granulares)
- ✅ Gestión de envíos especificada (pickup + tracking manual)
- ✅ Variantes de productos autogeneradas documentadas
- ✅ **NUEVO:** Sistema de logs y auditoría completo
- ✅ **NUEVO:** Interacciones sociales (likes, comentarios)
- ✅ **NUEVO:** Social feed en dashboard
- ✅ Límites de productos aclarados (500/tienda)
- ✅ Límites de empleados por plan definidos
- ✅ Roadmap expandido con nuevas fases
- ✅ Criterios de aceptación reorganizados y ampliados

### v0.1 - 2025-10-05
- Versión inicial del PRD
- Definición de MVP scope
- Arquitectura técnica base
- Roadmap inicial

---

**Última actualización:** 2025-10-05  
**Próxima revisión:** Post MVP 0.2  
**Autor:** [Tu nombre]  
**Estado:** ✅ Completo y listo para desarrollo