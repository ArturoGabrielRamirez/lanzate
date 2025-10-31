'use client'

import {/*  Upload, */ X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback } from 'react'

import { MyFilesTabProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'

export function MyFilesTab({
    type,
    previewUrl,
    mediaUpload,
    isActionDisabled
}: MyFilesTabProps) {
    const myFiles = mediaUpload.uploadHistory.uploads

    // Wrapper async para usePreset
    const handleSelectUpload = useCallback(async (url: string) => {
        await Promise.resolve(mediaUpload.usePreset(url))
    }, [mediaUpload])

    if (myFiles.length === 0) {
        return (
            <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm mb-4">
                    No has subido ningún {type} aún
                </p>
            </div>
        )
    }

    return (
        <div className={`grid gap-2 ${type === 'avatar' ? 'grid-cols-3' : 'grid-cols-2'
            }`}>
            {myFiles.map((url: string) => (
                <div
                    key={url}
                    className="relative group"
                >
                    <button
                        type="button"
                        className={`w-full ${type === 'avatar' ? 'aspect-square' : 'aspect-[16/9]'
                            } rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${previewUrl === url
                                ? 'border-primary ring-2 ring-primary/50'
                                : 'border-border hover:border-primary/50'
                            }`}
                        onClick={() => handleSelectUpload(url)}
                        disabled={isActionDisabled}
                    >
                        <Image
                            src={url}
                            alt="Upload"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={async (e) => {
                            e.stopPropagation()
                            await Promise.resolve(mediaUpload.uploadHistory.removeUpload(url))
                        }}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            ))}
        </div>
    )
}