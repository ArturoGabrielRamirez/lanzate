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
import { AvatarLayoutProps } from '../types'

export function AvatarLayout({
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
                        Has alcanzado el límite de 4 avatares. Elimina uno para subir otro.
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
                                    message="No has subido ningún avatar aún"
                                    onAction={() => onToolClick('upload')}
                                    actionLabel="Subir Ahora"
                                    disabled={uploadLimitReached}
                                />
                            ) : (
                                <MediaGrid
                                    items={myFiles}
                                    type="avatar"
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
                                            onSelect={(url) => mediaUpload.usePreset(url)}
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