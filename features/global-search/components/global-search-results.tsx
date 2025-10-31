'use client'

import { Search, ExternalLink } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import { SEARCH_MESSAGES } from "@/features/global-search/constants"
import { GlobalSearchResultsProps } from "@/features/global-search/types"

function GlobalSearchResults({ results, isLoading, query, onResultClick }: GlobalSearchResultsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
            {isLoading && (
                <div className="p-4 text-center text-muted-foreground">
                    <Search className="size-4 animate-spin mx-auto mb-2" />
                    {SEARCH_MESSAGES.SEARCHING}
                </div>
            )}

            {!isLoading && results.length === 0 && query.trim() && (
                <div className="p-4 text-center text-muted-foreground">
                    {SEARCH_MESSAGES.NO_RESULTS} &ldquo;{query}&rdquo;
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
                            onClick={onResultClick}
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
                    {SEARCH_MESSAGES.SHOWING_RESULTS} {results.length} {results.length !== 1 ? SEARCH_MESSAGES.RESULTS : SEARCH_MESSAGES.RESULT}
                </div>
            )}
        </motion.div>
    )
}

export { GlobalSearchResults }
