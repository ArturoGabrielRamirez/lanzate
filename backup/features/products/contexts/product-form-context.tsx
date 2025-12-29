"use client"

import { createContext, useContext, useState, ReactNode } from "react"

import type { DeferredFile } from "@/features/global/types/media"
import type {
  MediaSectionData,
  CategoriesSectionData,
  SizesSectionData,
  ColorsSectionData,
  SettingsSectionData,
  DimensionsSectionData,
  ProductFormState,
  ProductFormContextValue,
} from "@/features/products/types"

const initialState: ProductFormState = {
  media: { files: [], primaryIndex: null },
  categories: { categories: [] },
  sizes: { isUniqueSize: false, sizes: [], measures: [] },
  colors: { colors: [] },
  settings: { isActive: true, isFeatured: false, isPublished: true },
  dimensions: {},
  variants: [],
  variantExclusions: []
}

const ProductFormContext = createContext<ProductFormContextValue | undefined>(undefined)

export function ProductFormProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProductFormState>(initialState)

  const updateMedia = (data: Partial<MediaSectionData & { deferredFiles?: DeferredFile[] }>) => {
    console.log('📦 Context updateMedia called with:', {
      filesCount: data.files?.length,
      deferredFilesCount: data.deferredFiles?.length,
      primaryIndex: data.primaryIndex
    })

    setState(prev => {
      const newState = {
        ...prev,
        media: {
          files: data.files ?? prev.media.files,
          urls: data.urls ?? prev.media.urls,
          primaryIndex: data.primaryIndex ?? prev.media.primaryIndex,
          deferredFiles: data.deferredFiles ?? prev.media.deferredFiles
        }
      }

      console.log('📦 Context state after update:', {
        filesCount: newState.media.files?.length,
        deferredFilesCount: newState.media.deferredFiles?.length
      })

      return newState
    })
  }

  const updateCategories = (data: CategoriesSectionData) => {
    setState(prev => ({ ...prev, categories: data }))
  }

  const updateSizes = (data: SizesSectionData) => {
    setState(prev => ({ ...prev, sizes: data }))
  }

  const updateColors = (data: ColorsSectionData) => {
    setState(prev => ({ ...prev, colors: data }))
  }

  const updateSettings = (data: SettingsSectionData) => {
    setState(prev => ({ ...prev, settings: data }))
  }

  const updateDimensions = (data: DimensionsSectionData) => {
    setState(prev => ({ ...prev, dimensions: data }))
  }

  const updateVariants = (variants: ProductFormState['variants']) => {
    setState(prev => ({ ...prev, variants }))
  }

  const updateVariantExclusions = (exclusions: string[]) => {
    setState(prev => ({ ...prev, variantExclusions: exclusions }))
  }

  const resetForm = () => {
    setState(initialState)
  }

  return (
    <ProductFormContext.Provider
      value={{
        state,
        updateMedia,
        updateCategories,
        updateSizes,
        updateColors,
        updateSettings,
        updateDimensions,
        updateVariants,
        updateVariantExclusions,
        resetForm
      }}
    >
      {children}
    </ProductFormContext.Provider>
  )
}

export function useProductForm() {
  const context = useContext(ProductFormContext)
  if (!context) {
    throw new Error("useProductForm must be used within ProductFormProvider")
  }
  return context
}