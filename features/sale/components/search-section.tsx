"use client"

import { useState, useEffect } from 'react'
import { Search, Loader2, Plus, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { searchProductsByNameAction } from '../actions/search-products-by-name'
import type { ScannedProduct, ProductSearchByNameResult } from '../types'

type SearchSectionProps = {
  storeId: number
  onAddToCart: (product: ScannedProduct) => void
}

function SearchSection({ storeId, onAddToCart }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<ProductSearchByNameResult>({
    products: [],
    message: '',
    isLoading: false,
    error: false
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResult({
        products: [],
        message: '',
        isLoading: false,
        error: false
      })
      return
    }

    setSearchResult({
      products: [],
      message: 'Buscando productos...',
      isLoading: true,
      error: false
    })

    try {
      const { error, payload, message } = await searchProductsByNameAction(term, storeId)

      if (error || !payload) {
        setSearchResult({
          products: [],
          message: message || 'Error al buscar productos',
          isLoading: false,
          error: true
        })
      } else {
        setSearchResult({
          products: payload,
          message: payload.length > 0 ? `Se encontraron ${payload.length} productos` : 'No se encontraron productos',
          isLoading: false,
          error: payload.length === 0
        })
      }
    } catch (error) {
      console.error('Error buscando productos:', error)
      setSearchResult({
        products: [],
        message: 'Error al buscar productos',
        isLoading: false,
        error: true
      })
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
      {/* <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Search />
          Buscar Productos
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, descripción o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchResult.isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* {searchResult.message && (
            <div className={`text-sm p-2 rounded ${
              searchResult.error 
                ? 'text-red-600 bg-red-50 border border-red-200' 
                : 'text-blue-600 bg-blue-50 border border-blue-200'
            }`}>
              {searchResult.error && <AlertCircle className="inline h-4 w-4 mr-1" />}
              {searchResult.message}
            </div>
          )} */}

          {searchResult.products.length > 0 && (
            <div className="overflow-y-auto space-y-3">
              {searchResult.products.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-muted rounded border hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    {product.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {product.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-1">
                      {/* <Badge variant="outline" className="text-xs">
                        SKU: {product.sku}
                      </Badge> */}
                      {/* <Badge variant="outline" className="text-xs">
                        Stock: {product.totalStock}
                      </Badge> */}
                      <p className='text-xs'>
                        {product.totalStock} {product.totalStock > 1 ? 'units' : 'unit'} remaining
                      </p>
                      {product.categories.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {product.categories[0].name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-col">
                    <p className='font-bold text-lg'>
                      {formatPrice(product.price)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(product)}
                      disabled={product.totalStock === 0}
                      className="h-8"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchResult.isLoading && searchResult.products.length === 0 && searchTerm && !searchResult.error && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  No se encontraron productos
                </p>
                <p className="text-xs text-muted-foreground">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            </div>
          )}

          {/* {!searchTerm && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  Escribe para buscar productos
                </p>
                <p className="text-xs text-muted-foreground">
                  Busca por nombre, descripción o SKU
                </p>
              </div>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}

export default SearchSection 