import { useState, useEffect } from 'react'

import { LikedProduct } from '@/features/profile/types'

export function useLikedProducts(userId: number) {
    const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchLikedProducts() {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch(`/api/users/${userId}/liked-products?limit=20`)

                if (!response.ok) {
                    throw new Error('Error al cargar los productos')
                }

                const data = await response.json()
                setLikedProducts(data.likedProducts || [])

            } catch (err) {
                console.error('Error fetching liked products:', err)
                setError(err instanceof Error ? err.message : 'Error desconocido')
            } finally {
                setIsLoading(false)
            }
        }

        fetchLikedProducts()
    }, [userId])

    return { likedProducts, isLoading, error }
}