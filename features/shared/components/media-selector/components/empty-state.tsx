'use client'

import { Upload, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EmptyStateProps } from '../types'

export function EmptyState({
  type,
  mediaType,
  message,
  onAction,
  actionLabel,
  disabled
}: EmptyStateProps) {
  if (type === 'loading') {
    return (
      <Card className="p-12 bg-muted/20">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-current border-t-transparent mb-3" />
          <p className="text-sm text-muted-foreground">
            {message || `Cargando ${mediaType === 'avatar' ? 'avatares' : 'banners'}...`}
          </p>
        </div>
      </Card>
    )
  }

  if (type === 'error') {
    return (
      <Alert>
        <AlertDescription>
          {message || 'Error al cargar'}
          {onAction && (
            <Button
              variant="link"
              size="sm"
              onClick={onAction}
              className="ml-2 p-0 h-auto"
            >
              {actionLabel || 'Reintentar'}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  // type === 'empty'
  return (
    <Card className="p-12 bg-muted/20">
      <div className="text-center">
        <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-4">
          {message || `No has subido ningún ${mediaType} aún`}
        </p>
        {onAction && (
          <Button size="sm" onClick={onAction} disabled={disabled}>
            <Upload className="w-4 h-4 mr-2" />
            {actionLabel || 'Subir Ahora'}
          </Button>
        )}
      </div>
    </Card>
  )
}