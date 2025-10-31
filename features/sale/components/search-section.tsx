"use client"

import { Search, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'

import { searchProductsByNameAction } from '@/features/products/actions/search-products-by-name.action'
import type { ProductSearchByNameResult, SearchSectionProps, SearchSectionRef } from '@/features/sale/types'
import { Input } from '@/features/shadcn/components/ui/input'

const SearchSection = forwardRef<SearchSectionRef, SearchSectionProps>(({ storeId, onSearchResults }, ref) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<ProductSearchByNameResult>({
    products: [],
    message: '',
    isLoading: false,
    error: false
  })
  const t = useTranslations('sale.search')

  const clearSearch = () => {
    setSearchTerm('')
    const emptyResult = {
      products: [],
      message: '',
      isLoading: false,
      error: false
    }
    setSearchResult(emptyResult)
    onSearchResults(emptyResult)
  }

  useImperativeHandle(ref, () => ({ clearSearch }))

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      const emptyResult = { products: [], message: '', isLoading: false, error: false }
      setSearchResult(emptyResult)
      onSearchResults(emptyResult)
      return
    }

    const loadingResult = { products: [], message: t('searching'), isLoading: true, error: false }
    setSearchResult(loadingResult)
    onSearchResults(loadingResult)

    try {
      const { hasError, payload, message } = await searchProductsByNameAction(term, storeId)

      let result: ProductSearchByNameResult
      if (hasError || !payload) {
        result = { products: [], message: message || t('error'), isLoading: false, error: true }
      } else {
        result = {
          products: payload.map(p => ({
            ...p,
            barcode: p.barcode ?? '',
            description: p.description ?? '',
            image: p.image ?? '', // 👈 convierte null → '' //TODO:Revisar estos tipos.
          })),
          message: payload.length > 0 ? t('found', { count: payload.length }) : t('no-results'),
          isLoading: false,
          error: payload.length === 0
        }
      }

      setSearchResult(result)
      onSearchResults(result)
    } catch (error) {
      console.error('Error buscando productos:', error)
      const errorResult = { products: [], message: t('error'), isLoading: false, error: true }
      setSearchResult(errorResult)
      onSearchResults(errorResult)
    }
  }, [storeId, onSearchResults, t])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, handleSearch])

  return (
    <div className="relative flex items-center h-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={t('placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-0 h-full rounded-xl"
      />
      {searchResult.isLoading && (
        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  )
})

SearchSection.displayName = 'SearchSection'

export { SearchSection }
