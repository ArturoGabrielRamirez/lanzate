'use client'

import { X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

import { MediaPreviewWithRemoveProps } from '@/features/global/types/media'
import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar'
import { Button } from '@/features/shadcn/components/ui/button'

export function MediaPreview({
  type,
  previewUrl,
  onRemove,
  showRemove = false
}: MediaPreviewWithRemoveProps) {
  if (type === 'avatar') {
    return (
      <div className="relative inline-block group">
        <Avatar className="w-24 h-24 mx-auto ring-2 ring-border">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback>
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        {showRemove && previewUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted group">
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            fill
          />
          {showRemove && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}