"use server"

// Directiva para ejecutar en el servidor (Next.js Server Actions)

import { prisma } from "@/utils/prisma" // Importa el cliente de Prisma
import randomstring from "randomstring" // Genera cadenas aleatorias para SKU
import { actionWrapper } from "@/utils/lib" // Envoltorio para manejo de acciones/errores

type VariantInput = { // Tipo de entrada de una variante del producto
  id: string // Identificador temporal de la variante (del formulario)
  name?: string // Nombre opcional de la variante
  attributes: Record<string, string> // Atributos dinámicos clave-valor (ej: Color, Talle)
}

export type CreateProductFormValues = { // Tipo del formulario consumido por esta acción
  basic_info?: Record<string, unknown> // Grupo con nombre, slug, descripción, imagen
  media?: Record<string, unknown> // Media asociada
  pricing?: { price?: number; stock?: number } // Precio y stock
  settings?: { is_active?: boolean; is_featured?: boolean; is_published?: boolean } // Flags de publicación
  categories?: { label: string; value: string | number }[] // Categorías seleccionadas
  extra?: Record<string, unknown> // Datos extra (dimensiones, etc.)
  extra_meta?: Record<string, unknown> // Metadatos de extra
  variants?: { id: string; name?: string; attributes: Record<string, string> }[] // Variantes generadas
  variants_removed?: string[] // IDs de variantes removidas
}

export type InsertProductWithVariantsArgs = { // Argumentos esperados por la acción
  storeId: number // ID de la tienda
  userId: number // ID del usuario propietario
  form: CreateProductFormValues // Estructura del formulario de creación de producto
}

export async function insertProductWithVariants(args: InsertProductWithVariantsArgs) { // Acción principal para insertar producto y variantes
  return actionWrapper(async () => { // Ejecuta la lógica envuelta para manejo uniforme de errores
    const { storeId, userId, form } = args // Extrae parámetros de entrada

    const basic = form?.basic_info ?? {} // Obtiene datos básicos del formulario
    const pricing = form?.pricing ?? {} // Obtiene datos de precio e inventario
    const categories = Array.isArray(form?.categories) ? form.categories : [] // Normaliza categorías
    const variants: VariantInput[] = Array.isArray(form?.variants) ? form.variants : [] // Normaliza variantes
    const removed: string[] = Array.isArray(form?.variants_removed) ? form.variants_removed : [] // IDs de variantes removidas

    const priceNumber = Number.parseFloat(String(pricing.price ?? 0)) || 0 // Convierte precio a número
    const stockNumber = Number.parseInt(String(pricing.stock ?? 0), 10) || 0 // Convierte stock a entero

    const result = await prisma.$transaction(async (tx) => { // Inicia transacción atómica
      // Asegura slug único para el producto
      let slug: string = (basic?.slug || basic?.name || "").toString().toLowerCase().trim() // Genera base del slug
        .replace(/[^a-z0-9]+/g, '-') // Reemplaza separadores no válidos
        .replace(/^-+|-+$/g, '') // Quita guiones iniciales/finales
      if (!slug) slug = "producto-" + Date.now() // Fallback si no hay nombre
      let suffix = 1 // Contador para desambiguar slugs
      while (await tx.product.findUnique({ where: { slug } })) { // Itera hasta encontrar slug libre
        slug = `${slug}-${suffix++}` // Agrega sufijo incremental
      }

      // Crea el producto principal
      const skuBase = randomstring.generate(8) // SKU base del producto
      const product = await tx.product.create({ // Inserta registro de producto
        data: { // Campos a persistir
          name: String(basic?.name || "Producto"), // Nombre del producto
          description: (basic?.description as string | undefined) ?? null, // Descripción opcional
          slug, // Slug único
          price: priceNumber, // Precio numérico
          stock: stockNumber, // Stock inicial (será recalculado)
          store_id: storeId, // Tienda a la que pertenece
          owner_id: userId, // Propietario del producto
          sku: skuBase, // SKU base
          is_active: !!(form?.settings?.is_active ?? true), // Flag activo
          is_featured: !!(form?.settings?.is_featured ?? false), // Flag destacado
          is_published: !!(form?.settings?.is_published ?? true), // Flag publicado
          ...(categories.length > 0 ? { // Si hay categorías
            categories: { connect: categories.map((c: { value: string | number }) => ({ id: Number(c.value) })) } // Conecta categorías
          } : {}), // Sin categorías si arreglo vacío
        }
      })

      // Resolutores auxiliares: garantizan existencia y devuelven IDs
      async function ensureSizesId(label?: string | null): Promise<number | null> { // Asegura ID de talla
        if (!label) return null // Si no hay etiqueta, no aplica
        const found = await tx.sizes.findFirst({ where: { label } }) // Busca talla existente
        if (found) return found.id // Retorna ID si existe
        const created = await tx.sizes.create({ data: { label } }) // Crea talla si no existe
        return created.id // Retorna nuevo ID
      }
      async function ensureDimensionsId(label?: string | null): Promise<number | null> { // Asegura ID de tamaño/dimensión
        if (!label) return null // No aplica sin etiqueta
        const found = await tx.dimensions.findFirst({ where: { label } }) // Busca dimensión
        if (found) return found.id // Retorna si existe
        const created = await tx.dimensions.create({ data: { label } }) // Crea dimensión
        return created.id // Retorna nuevo ID
      }
      async function ensureMaterialId(label?: string | null): Promise<number | null> { // Asegura ID de material
        if (!label) return null // No aplica sin etiqueta
        const found = await tx.material.findFirst({ where: { label } }) // Busca material
        if (found) return found.id // Retorna si existe
        const created = await tx.material.create({ data: { label } }) // Crea material
        return created.id // Retorna nuevo ID
      }
      async function ensureFlavorId(label?: string | null): Promise<number | null> { // Asegura ID de sabor
        if (!label) return null // No aplica sin etiqueta
        const found = await tx.flavor.findFirst({ where: { label } }) // Busca sabor
        if (found) return found.id // Retorna si existe
        const created = await tx.flavor.create({ data: { label } }) // Crea sabor
        return created.id // Retorna nuevo ID
      }
      async function ensureFragranceId(label?: string | null): Promise<number | null> { // Asegura ID de fragancia
        if (!label) return null // No aplica sin etiqueta
        const found = await tx.fragrance.findFirst({ where: { label } }) // Busca fragancia
        if (found) return found.id // Retorna si existe
        const created = await tx.fragrance.create({ data: { label } }) // Crea fragancia
        return created.id // Retorna nuevo ID
      }
      async function ensureColorId(nameOrHex?: string | null): Promise<number | null> { // Asegura ID de color por nombre/hex
        if (!nameOrHex) return null // No aplica sin valor
        const found = await tx.color.findFirst({ where: { OR: [{ name: nameOrHex }, { hex: nameOrHex }] } }) // Busca por nombre u hex
        if (found) return found.id // Retorna si existe
        const created = await tx.color.create({ data: { name: nameOrHex, hex: /^#/.test(nameOrHex) ? nameOrHex : null } }) // Crea color
        return created.id // Retorna nuevo ID
      }

      // Determina sucursal objetivo para asignación de stock
      const primary = await tx.branch.findFirst({ where: { store_id: storeId, is_main: true } }) // Sucursal principal
      const fallback = primary ? null : await tx.branch.findFirst({ where: { store_id: storeId } }) // Alternativa si no hay principal
      const targetBranchId = (primary || fallback)?.id || null // ID de sucursal destino o null

      const effective = variants.filter(v => !removed.includes(v.id)) // Filtra variantes efectivas (no eliminadas)

      // Distribuye stock inicial equitativamente entre variantes
      const totalStock = Number.isFinite(stockNumber) ? stockNumber : 0 // Total de stock válido
      const perVariant = effective.length > 0 ? Math.floor(totalStock / effective.length) : 0 // Stock base por variante
      let remainder = effective.length > 0 ? (totalStock % effective.length) : 0 // Resto a repartir

      let derivedTotal = 0 // Acumulador de stock asignado
      for (const v of effective) { // Itera cada variante efectiva
        const attrs = v.attributes || {} // Atributos de la variante
        const sizeLabel = attrs["Talle"] || null // Talla si aplica
        const dimensionLabel = attrs["Tamaño"] || null // Dimensión si aplica
        const colorName = attrs["Color"] || null // Color si aplica
        const materialLabel = attrs["Material"] || null // Material si aplica
        const flavorLabel = attrs["Sabor"] || null // Sabor si aplica
        const fragranceLabel = attrs["Fragancia"] || null // Fragancia si aplica

        const [sizes_id, dimensions_id, color_id, material_id, flavor_id, fragrance_id] = await Promise.all([ // Resuelve IDs en paralelo
          ensureSizesId(sizeLabel), // ID talla
          ensureDimensionsId(dimensionLabel), // ID dimensión
          ensureColorId(colorName), // ID color
          ensureMaterialId(materialLabel), // ID material
          ensureFlavorId(flavorLabel), // ID sabor
          ensureFragranceId(fragranceLabel), // ID fragancia
        ])

        const allocation = perVariant + (remainder > 0 ? 1 : 0) // Asignación para esta variante
        if (remainder > 0) remainder -= 1 // Reduce resto si se usó

        await tx.productVariant.create({ // Crea la variante del producto
          data: { // Datos de la variante
            product_id: product.id, // Relación con producto
            name: String(v.name || basic?.name || "Producto"), // Nombre de variante
            price: priceNumber, // Precio de variante
            sizes_id, // FK talla
            dimensions_id, // FK dimensión
            color_id, // FK color
            material_id, // FK material
            flavor_id, // FK sabor
            fragrance_id, // FK fragancia
            is_active: true, // Activa por defecto
            is_published: !!(form?.settings?.is_published ?? true), // Publicada según ajustes
            sku: `${skuBase}-${randomstring.generate(4)}`, // SKU específico de variante
            ...(targetBranchId ? { stocks: { create: [{ branch_id: targetBranchId, quantity: allocation }] } } : {}), // Stock inicial en sucursal
          }
        })
        derivedTotal += allocation // Suma al stock total derivado
      }

      // Actualiza el stock del producto según suma de variantes
      if (derivedTotal !== product.stock) { // Solo si cambió
        await tx.product.update({ where: { id: product.id }, data: { stock: derivedTotal } }) // Persistir stock recalculado
      }

      return product // Devuelve el producto creado
    })

    return { payload: result, error: false, message: "ok" } // Respuesta normalizada del actionWrapper
  })
} // Fin de insertProductWithVariants


