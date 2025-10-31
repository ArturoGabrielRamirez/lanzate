'use client'

import { Search, Loader } from "lucide-react"

import { SEARCH_CONFIG } from "@/features/global-search/constants"
import { GlobalSearchInputProps } from "@/features/global-search/types"
import { Field } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/features/shadcn/components/input-group"

function GlobalSearchInput({ query, setQuery, isLoading, onFocus }: GlobalSearchInputProps) {
    return (
        <div className="flex gap-2 relative z-50">
            <Field>
                <InputGroup className="rounded-full bg-background border-border shadow-lg">
                    <InputGroupAddon>
                        <Search className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder={SEARCH_CONFIG.SEARCH_PLACEHOLDER}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={onFocus}
                    />
                    {isLoading && (
                        <InputGroupAddon align="inline-end">
                            <Loader className="size-4 animate-spin" />
                        </InputGroupAddon>
                    )}
                </InputGroup>
            </Field>
        </div>
    )
}

export { GlobalSearchInput }
