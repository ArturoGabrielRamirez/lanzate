"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import type { DeferredFile } from "@/features/global/types/media"
import { ProductMediaSelector } from "@/features/products/components/product-media-selector"
import { useProductForm } from "@/features/products/contexts/product-form-context"
import type { MediaSectionProps } from "@/features/products/types"

export function MediaSection({ value, onChange }: MediaSectionProps) {
  const { setValue } = useFormContext()
  const { state, updateMedia } = useProductForm()

  const currentFiles = state.media.deferredFiles || []

  //TODO: Revisar el debug para ver si esta haciendo lo debido

  // 🔍 DEBUG: Log para ver qué pasa
  useEffect(() => {
    console.log('🖼️ MediaSection mount - currentFiles:', currentFiles.length)
    console.log('🖼️ MediaSection mount - state.media:', state.media)
  }, [currentFiles.length, state.media])

  useEffect(() => {
    console.log('🖼️ MediaSection update - currentFiles:', currentFiles.length)
  }, [currentFiles.length])

  useEffect(() => {
    if (value && currentFiles.length === 0) {
      const initialFiles: DeferredFile[] = (() => {
        // Si tiene files (archivos nuevos)
        if ("files" in value && Array.isArray(value.files) && value.files.length > 0) {
          return value.files.map((file, index) => ({
            id: `file-${index}-${Date.now()}`,
            file,
            preview: URL.createObjectURL(file),
            isPrimary: index === (value.primaryIndex ?? 0)
          }))
        }

        // Si tiene urls (archivos existentes)
        if (value.urls && Array.isArray(value.urls) && value.urls.length > 0) {
          return value.urls.map((url, index) => ({
            id: `url-${index}-${Date.now()}`,
            file: new File([], `image-${index}`),
            preview: url,
            isPrimary: index === (value.primaryIndex ?? 0)
          }))
        }

        return []
      })()

      if (initialFiles.length > 0) {
        updateMedia({ deferredFiles: initialFiles })
      }
    }
  }, [ currentFiles.length, value, updateMedia ]) // Solo al montar

  return (
    <ProductMediaSelector
      value={currentFiles}
      onChange={(deferredFiles) => {
        const files = deferredFiles.map(df => df.file)
        const primaryIndex = deferredFiles.findIndex(df => df.isPrimary)

        // ✅ Actualizar el contexto (esto persiste entre navegaciones)
        updateMedia({
          files,
          urls: deferredFiles.map(df => df.preview),
          primaryIndex: primaryIndex >= 0 ? primaryIndex : null,
          deferredFiles // ✅ Guardar los DeferredFile completos
        })

        // ✅ Notificar al componente padre (si existe)
        onChange?.({
          urls: deferredFiles.map(df => df.preview),
          primaryIndex: primaryIndex >= 0 ? primaryIndex : null
        })

        // ✅ Sync con React Hook Form
        setValue("images", files, { shouldDirty: true })
        setValue("primary-image", primaryIndex >= 0 ? primaryIndex : null, { shouldDirty: true })
      }}
      maxFiles={5}
    />
  )
}