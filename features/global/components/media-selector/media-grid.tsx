'use client'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { MediaGridProps } from '@/features/global/types/media'

export function MediaGrid({
    items,
    type,
    onSelect,
    onDelete,
    selectedUrl
}: MediaGridProps) {
    const [deletingUrl, setDeletingUrl] = useState<string | null>(null)

    const handleDelete = async (url: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!onDelete) return

        setDeletingUrl(url)
        try {
            await Promise.resolve(onDelete(url))
        } finally {
            setDeletingUrl(null)
        }
    }

    const handleSelect = async (url: string) => {
        await Promise.resolve(onSelect(url))
    }

    return (
        <div className={`grid gap-2 ${type === 'avatar' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {items.map((item, index) => {
                const itemId = String(item.id || item.url || index)
                return (
                    <div key={itemId} className="relative group">
                        <button
                            type="button"
                            onClick={() => handleSelect(item.url)}
                            disabled={deletingUrl === item.url}
                            className={`w-full rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:z-10 disabled:opacity-50 ${selectedUrl === item.url
                                ? 'border-primary ring-2 ring-primary/50'
                                : 'border-border hover:border-primary/50'
                                }`}
                            style={{ aspectRatio: type === 'avatar' ? '1/1' : '16/9' }}
                        >
                            <Image src={item.url} alt={item.name || 'Media'} className="w-full h-full object-cover" />
                        </button>

                        {onDelete && (
                            <button
                                type="button"
                                onClick={(e) => handleDelete(item.url, e)}
                                disabled={deletingUrl === item.url}
                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 z-20"
                            >
                                {deletingUrl === item.url ? (
                                    <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <Trash2 className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}