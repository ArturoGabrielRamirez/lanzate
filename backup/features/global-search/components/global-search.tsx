'use client'

import { AnimatePresence } from "motion/react"

import { GlobalSearchInput } from "@/features/global-search/components/global-search-input"
import { GlobalSearchResults } from "@/features/global-search/components/global-search-results"
import { useGlobalSearch } from "@/features/global-search/hooks"
import { GlobalSearchProps } from "@/features/global-search/types"


function GlobalSearch({ userId }: GlobalSearchProps) {
    const {
        query,
        setQuery,
        results,
        isLoading,
        showResults,
        setShowResults,
        searchRef,
        handleInputFocus,
    } = useGlobalSearch(userId)

    return (
        <div ref={searchRef} className="relative w-full">
            {showResults && (results.length > 0 || isLoading) && (
                <div className="fixed inset-0 z-40 bg-background/50 backdrop-blur-xs" onClick={() => setShowResults(false)}></div>
            )}
            
            <GlobalSearchInput
                query={query}
                setQuery={setQuery}
                isLoading={isLoading}
                onFocus={handleInputFocus}
            />

            <AnimatePresence>
                {showResults && (results.length > 0 || isLoading) && (
                    <GlobalSearchResults
                        results={results}
                        isLoading={isLoading}
                        query={query}
                        onResultClick={() => setShowResults(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export { GlobalSearch }