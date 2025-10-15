'use client'

import { Search, ExternalLink, Loader } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

import { SEARCH_CONFIG, SEARCH_MESSAGES } from "@/features/global-search/constants"
import { useGlobalSearch } from "@/features/global-search/hooks"
import { GlobalSearchProps } from "@/features/global-search/types"
import { Field } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/features/shadcn/components/input-group"


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
            <div className="flex gap-2 relative z-50">
                <Field>
                    <InputGroup className="rounded-full bg-background border-border shadow-xs">
                        <InputGroupAddon>
                            <Search className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder={SEARCH_CONFIG.SEARCH_PLACEHOLDER}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={handleInputFocus}
                        />
                        {isLoading && (
                            <InputGroupAddon align="inline-end">
                                <Loader className="size-4 animate-spin" />
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                </Field>
            </div>

            <AnimatePresence>
                {showResults && (results.length > 0 || isLoading) && (
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
                                {SEARCH_MESSAGES.SHOWING_RESULTS} {results.length} {results.length !== 1 ? SEARCH_MESSAGES.RESULTS : SEARCH_MESSAGES.RESULT}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export { GlobalSearch }