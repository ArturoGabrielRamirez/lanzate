'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Camera, Image as ImageIcon, Upload, Loader2 } from 'lucide-react'
import { useCamera } from '@/features/auth/hooks/use-camera'
import { TooltipContent } from '@/components/ui/tooltip'
import { IconButton } from '@/src/components/ui/shadcn-io/icon-button'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
type StoreBannerEditorProps = {
    currentBanner: string | null
    storeName: string
    onBannerUpdate: (newBannerUrl: string | null) => void
}

export function StoreBannerEditor({ currentBanner, storeName, onBannerUpdate }: StoreBannerEditorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    console.log("🚀 ~ StoreBannerEditor ~ isUploading:", isUploading)

    const camera = useCamera({
        uploadPath: 'store-banners',
        onSuccess: (url) => {
            onBannerUpdate(url)
            setIsOpen(false)
            resetState()
        },
        onError: () => toast.error('Error al subir la foto'),
        quality: 0.9
    })

    function resetState() {
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Selecciona una imagen válida')
            return
        }

        const maxSize = 8 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB`)
            return
        }

        setSelectedFile(file)

        const reader = new FileReader()
        reader.onload = (e) => setPreviewUrl(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    async function handleUpload() {
        if (!selectedFile) {
            toast.error('No hay archivo seleccionado')
            return
        }
        setIsUploading(true)
        toast.promise(
            (async () => {
                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('type', 'store-banner')

                const response = await fetch('/api/store-banner', { method: 'POST', body: formData })
                if (!response.ok) throw new Error('Error uploading file')
                const data = await response.json()
                onBannerUpdate(data.url)
                setIsOpen(false)
                resetState()
            })(),
            {
                loading: 'Subiendo banner...',
                success: 'Banner subido correctamente',
                error: (error) => error.message,
                finally: () => setIsUploading(false)
            }
        )
    }

    function getPreview() {
        if (camera.capturedFile) return camera.capturedFile.preview
        if (previewUrl) return previewUrl
        return (
            currentBanner || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(storeName)}&backgroundColor=transparent`
        )
    }

    useEffect(() => {
        if (!isOpen) {
            resetState()
            camera.discardPhoto()
        }
    }, [isOpen, camera])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton
                                icon={ImageIcon}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            Cambiar banner de la tienda
                        </TooltipContent>
                    </Tooltip>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Cambiar banner de la tienda
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="rounded-md overflow-hidden border">
                        <img src={getPreview()} alt="Store banner preview" className="w-full h-40 object-cover" />
                    </div>

                    {camera.capturedFile ? (
                        <div className="flex gap-2">
                            <Button onClick={camera.retakePhoto} variant="outline" size="sm" disabled={camera.isUploading || isUploading}>
                                <Camera className="h-4 w-4 mr-2" />
                                Retomar
                            </Button>
                            <Button
                                onClick={() =>
                                    toast.promise(camera.uploadPhoto(), {
                                        loading: 'Subiendo banner...',
                                        success: 'Banner subido correctamente',
                                        error: 'Error al subir la foto'
                                    })
                                }
                                disabled={camera.isUploading}
                                size="sm"
                            >
                                {camera.isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Subiendo...
                                    </>
                                ) : (
                                    'Usar como Banner'
                                )}
                            </Button>
                            <Button onClick={camera.discardPhoto} variant="destructive" size="sm" disabled={camera.isUploading || isUploading}>
                                Descartar
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={camera.openCamera} variant="outline" className="flex-1" disabled={isUploading}>
                                <Camera className="h-4 w-4 mr-2" />
                                Tomar Foto
                            </Button>
                            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1" disabled={isUploading}>
                                <Upload className="h-4 w-4 mr-2" />
                                Seleccionar archivo
                            </Button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button onClick={handleUpload} disabled={!selectedFile || camera.isUploading || isUploading} className="flex-1">
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                'Subir Archivo'
                            )}
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpen(false)
                                resetState()
                                camera.discardPhoto()
                            }}
                            variant="secondary"
                            disabled={isUploading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


