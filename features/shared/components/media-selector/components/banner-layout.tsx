'use client'

import { useState } from 'react'
import { Upload, Camera, Scissors, Sparkles, AlertCircle } from 'lucide-react'
import { Card } from '@/features/shadcn/components/ui/card'
import { Button } from '@/features/shadcn/components/ui/button'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { MediaPreview } from './media-preview'
import { ToolButton } from './tool-button'
import { MediaTabs } from './media-tabs'
import { MediaGrid } from './media-grid'
import { EmptyState } from './empty-state'
import { BannerLayoutProps } from '../types'

export function BannerLayout({
    previewUrl,
    showUploadButton,
    uploadLimitReached,
    isActionDisabled,
    uploadsCount,
    myFiles,
    allOptions,
    isGalleryLoading,
    galleryError,
    mediaUpload,
    mediaOptions,
    onToolClick,
    onClearPreview
}: BannerLayoutProps) {
    const [activeTab, setActiveTab] = useState<'my-files' | 'gallery'>('my-files')
    const [showAllGallery, setShowAllGallery] = useState(false)

    return (
        <div className="space-y-4">
            {/* Alert de límite */}
            {uploadLimitReached && (
                <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <AlertDescription>
                        Has alcanzado el límite de 4 banners. Elimina uno para subir otro.
                    </AlertDescription>
                </Alert>
            )}

            {/* Preview Grande con Herramientas superpuestas */}
            <Card className="p-4 relative">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-muted-foreground">Vista Previa</p>
                    {showUploadButton && previewUrl && (
                        <button
                            type="button"
                            onClick={onClearPreview}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                <div className="relative">
                    <MediaPreview
                        type="banner"
                        previewUrl={previewUrl}
                        onRemove={onClearPreview}
                        showRemove={false}
                    />

                    {/* Barra de Herramientas flotante a la derecha */}
                    <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg p-2">
                        <div className="flex gap-1.5">
                            <ToolButton
                                icon={Upload}
                                label="Subir"
                                onClick={() => onToolClick('upload')}
                                disabled={uploadLimitReached || isActionDisabled}
                                color="default"
                                compact
                            />
                            <ToolButton
                                icon={Camera}
                                label="Cámara"
                                onClick={() => onToolClick('camera')}
                                disabled={uploadLimitReached || isActionDisabled}
                                color="camera"
                                compact
                            />
                            <ToolButton
                                icon={Scissors}
                                label="Recortar"
                                onClick={() => onToolClick('crop')}
                                disabled={isActionDisabled}
                                color="crop"
                                compact
                            />
                            <ToolButton
                                icon={Sparkles}
                                label="IA"
                                onClick={() => onToolClick('removeBg')}
                                disabled={isActionDisabled}
                                color="ai"
                                compact
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <MediaTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                uploadsCount={uploadsCount}
                galleryCount={allOptions.length}
            />

            {/* Tab Content */}
            <div className="min-h-[280px]">
                {activeTab === 'my-files' && (
                    myFiles.length === 0 ? (
                        <EmptyState
                            type="empty"
                            mediaType="banner"
                            message="No has subido ningún banner aún"
                            onAction={() => onToolClick('upload')}
                            actionLabel="Subir Ahora"
                            disabled={uploadLimitReached}
                        />
                    ) : (
                        <MediaGrid
                            items={myFiles}
                            type="banner"
                            onSelect={(url) => mediaUpload.usePreset(url)}
                            onDelete={(url) => mediaUpload.uploadHistory.removeUpload(url)}
                            selectedUrl={previewUrl}
                        />
                    )
                )}

                {activeTab === 'gallery' && (
                    isGalleryLoading ? (
                        <EmptyState
                            type="loading"
                            mediaType="banner"
                        />
                    ) : galleryError ? (
                        <EmptyState
                            type="error"
                            mediaType="banner"
                            message={galleryError}
                            onAction={mediaOptions.loadBannerOptions}
                            actionLabel="Reintentar"
                        />
                    ) : allOptions.length === 0 ? (
                        <EmptyState
                            type="empty"
                            mediaType="banner"
                            message="No hay banners disponibles"
                        />
                    ) : (
                        <>
                            <div className={showAllGallery ? '' : 'max-h-[280px] overflow-y-auto'}>
                                <MediaGrid
                                    items={allOptions}
                                    type="banner"
                                    onSelect={(url) => mediaUpload.usePreset(url)}
                                    selectedUrl={previewUrl}
                                />
                            </div>
                            {allOptions.length > 6 && !showAllGallery && (
                                <Button
                                    variant="ghost"
                                    className="w-full mt-3 text-sm"
                                    onClick={() => setShowAllGallery(true)}
                                >
                                    Ver todos ({allOptions.length})
                                </Button>
                            )}
                        </>
                    )
                )}
            </div>
        </div>
    )
}