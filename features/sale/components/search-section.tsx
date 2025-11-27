"use client"

import { Search } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { searchProductsByNameAction } from '@/features/products/actions/search-products-by-name.action'
import { SearchSectionProps, SearchSectionRef, ScannedProduct } from '@/features/sale/types'
import { Input } from '@/features/shadcn/components/ui/input'

const SearchSection = forwardRef<SearchSectionRef, SearchSectionProps>(
  ({ storeId, onSearchResults }, ref) => {
    const [searchQuery, setSearchQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      clearSearch: () => {
        setSearchQuery('')
        onSearchResults({
          products: [],
          message: '',
          isLoading: false,
          error: false
        })
      },
      focusSearch: () => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }))

    const handleSearch = async (query: string) => {
      setSearchQuery(query)

      if (!query.trim()) {
        onSearchResults({
          products: [],
          message: '',
          isLoading: false,
          error: false
        })
        return
      }

      onSearchResults({
        products: [],
        message: 'Buscando...',
        isLoading: true,
        error: false
      })

      try {
        const { hasError, payload, message } = await searchProductsByNameAction(query, storeId)

        if (hasError || !payload) {
          onSearchResults({
            products: [],
            message: message || 'No se encontraron productos',
            isLoading: false,
            error: true
          })
        } else {
          // Convertir los productos al tipo correcto
          const products: ScannedProduct[] = payload.map(product => ({
            ...product,
            description: product.description ?? undefined,
            barcode: product.barcode ?? undefined,
            sku: product.sku ?? undefined,
            image: product.image ?? undefined,
          }))

          onSearchResults({
            products,
            message: products.length === 0 ? 'No se encontraron productos' : '',
            isLoading: false,
            error: false
          })
        }
      } catch (error) {
        console.error('Error buscando productos:', error)
        onSearchResults({
          products: [],
          message: 'Error al buscar productos',
          isLoading: false,
          error: true
        })
      }
    }

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar por nombre o descripción... (Ctrl+B)"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
    )
  }
)

SearchSection.displayName = 'SearchSection'

export { SearchSection }