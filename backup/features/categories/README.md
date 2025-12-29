# Sistema de Categorías Dinámicas

## Descripción

Este módulo implementa un sistema de categorías dinámicas que permite a cada tienda configurar sus propias categorías de productos, mientras mantiene un conjunto de categorías por defecto que se crean automáticamente al crear una nueva tienda.

## Características

- **Categorías por Tienda**: Cada tienda tiene sus propias categorías independientes
- **Categorías por Defecto**: Al crear una nueva tienda, se crean automáticamente 5 categorías por defecto
- **Gestión Completa**: Crear, editar, eliminar y reordenar categorías
- **Soft Delete**: Las categorías se marcan como inactivas en lugar de eliminarse físicamente
- **Validación**: Esquemas de validación con Yup
- **Permisos**: Control de acceso basado en roles de empleados

## Estructura de Archivos

```
features/categories/
├── actions/
│   ├── createCategory.ts
│   ├── updateCategory.ts
│   └── deleteCategory.ts
├── data/
│   └── getStoreCategories.ts
├── access/
│   └── canManageCategories.ts
├── schemas/
│   └── category-schema.ts
├── types/
│   └── index.ts
└── README.md
```

## Modelos de Base de Datos

### Category
- `id`: Identificador único
- `name`: Nombre de la categoría
- `description`: Descripción opcional
- `image`: URL de imagen opcional
- `slug`: Slug único dentro de la tienda
- `store_id`: ID de la tienda a la que pertenece
- `is_default`: Indica si es una categoría por defecto
- `sort_order`: Orden de visualización
- `is_active`: Estado activo/inactivo
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### DefaultCategory
- `id`: Identificador único
- `name`: Nombre de la categoría
- `description`: Descripción opcional
- `image`: URL de imagen opcional
- `slug`: Slug único global
- `sort_order`: Orden de visualización
- `is_active`: Estado activo/inactivo
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

## Categorías por Defecto

Al crear una nueva tienda, se crean automáticamente las siguientes categorías:

1. **General** - Productos generales de la tienda
2. **Destacados** - Productos destacados y promociones
3. **Novedades** - Productos nuevos y recientes
4. **Ofertas** - Productos en oferta y descuentos
5. **Más Vendidos** - Productos más populares

## Funciones Principales

### getStoreCategories(storeId: number)
Obtiene todas las categorías activas de una tienda, ordenadas por `sort_order`.

### createCategory(storeId: number, payload)
Crea una nueva categoría en la tienda especificada.

### updateCategory(storeId: number, categoryId: number, payload)
Actualiza una categoría existente.

### deleteCategory(storeId: number, categoryId: number)
Elimina una categoría (soft delete - marca como inactiva).

### canManageCategories(userId: number, storeId: number)
Verifica si un usuario puede gestionar categorías en la tienda.

## Validaciones

- **Nombre**: Requerido, 2-50 caracteres
- **Descripción**: Opcional, máximo 200 caracteres
- **Imagen**: Opcional, debe ser URL válida
- **Orden**: Opcional, número mayor o igual a 0

## Restricciones

- No se pueden eliminar categorías por defecto
- No se pueden eliminar categorías que tengan productos
- Los slugs deben ser únicos dentro de cada tienda
- Solo usuarios autorizados pueden gestionar categorías

## Migración

Para aplicar estos cambios:

1. Ejecutar las migraciones de Prisma
2. Ejecutar el seed para crear las categorías por defecto
3. Regenerar el cliente de Prisma

```bash
bun x prisma migrate dev --name add_dynamic_categories
bun x prisma db seed
bun x prisma generate
``` 