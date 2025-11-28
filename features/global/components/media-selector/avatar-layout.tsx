'use client'

import { Upload, Camera, Scissors, Sparkles, AlertCircle } from 'lucide-react'
import { useState } from 'react'

import { EmptyState } from '@/features/global/components/media-selector/empty-state'
import { MediaGrid } from '@/features/global/components/media-selector/media-grid'
import { MediaPreview } from '@/features/global/components/media-selector/media-preview'
import { MediaTabs } from '@/features/global/components/media-selector/media-tabs'
import { ToolButton } from '@/features/global/components/media-selector/tool-button'
import { AvatarLayoutProps } from '@/features/global/types/media'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card } from '@/features/shadcn/components/ui/card'


export function AvatarLayout({
    previewUrl,
    /*     showUploadButton, */ //TODO: ver si se sigue necesitando esto y agregar a index todos los media que vienen de la misma ruta.
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
}: AvatarLayoutProps) {
    const [activeTab, setActiveTab] = useState<'my-files' | 'gallery'>('my-files')
    const [showAllGallery, setShowAllGallery] = useState(false)

    return (
        <div className="space-y-4">
            {/* Alert de límite */}
            {uploadLimitReached && (
                <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <AlertDescription>
                        Alcanzaste el límite de 4 avatares. Eliminá uno para subir otro o actualizá tu plan para aumentar el límite.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
                {/* Sidebar: Preview con Herramientas flotantes */}
                <div className="space-y-0">
                    <Card className="p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
                            Vista Previa
                        </p>
                        <div className="relative flex justify-center">
                            <MediaPreview
                                type="avatar"
                                previewUrl={previewUrl}
                                onRemove={onClearPreview}
                                showRemove={false}
                            />

                            {/* Barra de Herramientas flotante - Derecha Abajo */}
                            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl border shadow-xl p-2">
                                <div className="flex gap-2">
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
                </div>

                {/* Content Area */}
                <div>
                    <MediaTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        uploadsCount={uploadsCount}
                        galleryCount={allOptions.length}
                    />

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'my-files' && (
                            myFiles.length === 0 ? (
                                <EmptyState
                                    type="empty"
                                    mediaType="avatar"
                                    message="No subiste ningún avatar aún"
                                    onAction={() => onToolClick('upload')}
                                    actionLabel="Subir Ahora"
                                    disabled={uploadLimitReached}
                                />
                            ) : (
                                <MediaGrid
                                    items={myFiles}
                                    type="avatar"
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
                                    mediaType="avatar"
                                />
                            ) : galleryError ? (
                                <EmptyState
                                    type="error"
                                    mediaType="avatar"
                                    message={galleryError}
                                    onAction={mediaOptions.loadAvatarOptions}
                                    actionLabel="Reintentar"
                                />
                            ) : allOptions.length === 0 ? (
                                <EmptyState
                                    type="empty"
                                    mediaType="avatar"
                                    message="No hay avatares disponibles"
                                />
                            ) : (
                                <>
                                    <div className={showAllGallery ? '' : 'max-h-[400px] overflow-y-auto'}>
                                        <MediaGrid
                                            items={allOptions}
                                            type="avatar"
                                            onSelect={(url: string) => mediaUpload.usePreset(url)}
                                            selectedUrl={previewUrl}
                                        />
                                    </div>
                                    {allOptions.length > 12 && !showAllGallery && (
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
            </div>
        </div>
    )
}