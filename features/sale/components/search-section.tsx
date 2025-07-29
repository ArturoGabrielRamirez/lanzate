"use client"

import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { searchProductsByNameAction } from '../actions/search-products-by-name'
import type { ScannedProduct, ProductSearchByNameResult } from '../types'
import { useTranslations } from 'next-intl'

type SearchSectionProps = {
  storeId: number
  onAddToCart: (product: ScannedProduct) => void
  onSearchResults: (results: ProductSearchByNameResult) => void
}

function SearchSection({ storeId, onSearchResults }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<ProductSearchByNameResult>({
    products: [],
    message: '',
    isLoading: false,
    error: false
  })
  const t = useTranslations('sale.search')

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      const emptyResult = {
        products: [],
        message: '',
        isLoading: false,
        error: false
      }
      setSearchResult(emptyResult)
      onSearchResults(emptyResult)
      return
    }

    const loadingResult = {
      products: [],
      message: t('searching'),
      isLoading: true,
      error: false
    }
    setSearchResult(loadingResult)
    onSearchResults(loadingResult)

    try {
      const { error, payload, message } = await searchProductsByNameAction(term, storeId)

      let result: ProductSearchByNameResult
      if (error || !payload) {
        result = {
          products: [],
          message: message || t('error'),
          isLoading: false,
          error: true
        }
      } else {
        result = {
          products: payload,
          message: payload.length > 0 ? t('found', { count: payload.length }) : t('no-results'),
          isLoading: false,
          error: payload.length === 0
        }
      }
      
      setSearchResult(result)
      onSearchResults(result)
    } catch (error) {
      console.error('Error buscando productos:', error)
      const errorResult = {
        products: [],
        message: t('error'),
        isLoading: false,
        error: true
      }
      setSearchResult(errorResult)
      onSearchResults(errorResult)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, storeId])

  return (
    <Card className='lg:area-[search] h-fit'>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchResult.isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SearchSection 