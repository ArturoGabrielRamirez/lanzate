'use client'

import { Upload, Camera, Scissors, Sparkles, AlertCircle } from 'lucide-react'
import { useState } from 'react'

import { EmptyState } from '@/features/global/components/media-selector/empty-state'
import { MediaGrid } from '@/features/global/components/media-selector/media-grid'
import { MediaPreview } from '@/features/global/components/media-selector/media-preview'
import { MediaTabs } from '@/features/global/components/media-selector/media-tabs'
import { ToolButton } from '@/features/global/components/media-selector/tool-button'
import { BannerLayoutProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/button'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { Card } from '@/features/shadcn/components/ui/card'


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
                        Alcanzaste el límite de 4 banners. Eliminá uno para subir otro o actualizá tu plan para aumentar el límite.
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
                            message="No subiste ningún banner aún"
                            onAction={() => onToolClick('upload')}
                            actionLabel="Subir Ahora"
                            disabled={uploadLimitReached}
                        />
                    ) : (
                        <MediaGrid
                            items={myFiles}
                            type="banner"
                            onSelect={(url: string) => mediaUpload.usePreset(url)}
                            onDelete={(url: string) => mediaUpload.uploadHistory.removeUpload(url)}
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
                                    onSelect={(url: string) => mediaUpload.usePreset(url)}
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