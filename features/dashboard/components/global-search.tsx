'use client'

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { searchGlobalAction } from "../actions/search-global-action"
import { useDebounce } from "@/hooks/use-debounce"

type SearchResult = {
    id: string | number
    type: 'product' | 'order' | 'customer'
    title: string
    subtitle: string
    href: string | null
    icon: string
}

type GlobalSearchProps = {
    userId: number
}

export default function GlobalSearch({ userId }: GlobalSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const debouncedQuery = useDebounce(query, 300)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function performSearch() {
            if (!debouncedQuery.trim()) {
                setResults([])
                setShowResults(false)
                return
            }

            setIsLoading(true)
            try {
                const result = await searchGlobalAction(debouncedQuery, userId)
                if (result.error) {
                    console.error('Search error:', result.message)
                    setResults([])
                } else {
                    setResults(result.payload || [])
                    setShowResults(true)
                }
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        performSearch()
    }, [debouncedQuery, userId])

    // Close results when clicking outside
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

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="flex gap-2">
                <Input 
                    placeholder="Product ID/name, Order ID, Customer name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    className="flex-1"
                />
                <Button variant="outline" disabled={isLoading}>
                    <Search className="size-4" />
                </Button>
            </div>

            <AnimatePresence>
                {showResults && (results.length > 0 || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                    >
                        {isLoading && (
                            <div className="p-4 text-center text-muted-foreground">
                                <Search className="size-4 animate-spin mx-auto mb-2" />
                                Searching...
                            </div>
                        )}

                        {!isLoading && results.length === 0 && query.trim() && (
                            <div className="p-4 text-center text-muted-foreground">
                                No results found for &ldquo;{query}&rdquo;
                            </div>
                        )}

                        {!isLoading && results.map((result, index) => (
                            <motion.div
                                key={`${result.type}-${result.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                                {result.href ? (
                                    <Link
                                        href={result.href}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setShowResults(false)}
                                    >
                                        <span className="text-lg">{result.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {result.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {result.subtitle}
                                            </div>
                                        </div>
                                        <ExternalLink className="size-3 text-muted-foreground flex-shrink-0" />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3 p-3">
                                        <span className="text-lg">{result.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {result.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {result.subtitle}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {!isLoading && results.length > 0 && (
                            <div className="p-2 text-xs text-center text-muted-foreground border-t border-gray-100 dark:border-gray-700">
                                Showing {results.length} result{results.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 