'use client'

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { searchGlobalAction } from "@/features/global-search/actions"
import { SEARCH_CONFIG } from "@/features/global-search/constants"
import { useDebounce } from "@/features/global-search/hooks/use-debounce"
import { SearchResult, UseGlobalSearchReturn } from "@/features/global-search/types"

export function useGlobalSearch(userId: number): UseGlobalSearchReturn {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const debouncedQuery = useDebounce(query, SEARCH_CONFIG.DEBOUNCE_DELAY)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([])
                setShowResults(false)
                return
            }

            setIsLoading(true)
            const { hasError, payload, message } = await searchGlobalAction(debouncedQuery, userId)

            if (hasError) {
                toast.error(message)
                setIsLoading(false)
                return setResults([])
            }

            setResults(payload || [])
            setShowResults(true)
            setIsLoading(false)
        }

        performSearch()
    }, [debouncedQuery, userId])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputFocus = () => {
        if (results.length > 0) {
            setShowResults(true)
        }
    }

    return {
        query,
        setQuery,
        results,
        isLoading,
        showResults,
        setShowResults,
        searchRef,
        handleInputFocus,
    }
}
