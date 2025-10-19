'use client'

import { useState, useCallback } from 'react'
import type { CapturedFile, UseCameraCaptureProps } from '../types'
import { createPreviewUrl, revokePreviewUrl } from '.'


export function useCameraCapture({
    type,
    validationOptions,
    onCapture
}: UseCameraCaptureProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [capturedFile, setCapturedFile] = useState<CapturedFile | null>(null)

    /**
     * Abre la cámara
     */
    const openCamera = useCallback(() => {
        setIsCameraOpen(true)
    }, [])

    /**
     * Cierra la cámara
     */
    const closeCamera = useCallback(() => {
        setIsCameraOpen(false)
    }, [])

    /**
     * Maneja la captura de la cámara
     */
    const handleCapture = useCallback(
        async (file: File) => {
            try {
                const preview = createPreviewUrl(file)

                const captured: CapturedFile = {
                    file,
                    preview,
                    timestamp: Date.now()
                }

                setCapturedFile(captured)
                setIsCameraOpen(false)

                // Notificar al padre
                onCapture?.(file)
            } catch (error) {
                console.error('Error handling camera capture:', error)
                setIsCameraOpen(false)
            }
        },
        [onCapture]
    )

    /**
     * Permite tomar otra foto
     */
    const retakePhoto = useCallback(() => {
        if (capturedFile) {
            revokePreviewUrl(capturedFile.preview)
            setCapturedFile(null)
        }
        setIsCameraOpen(true)
    }, [capturedFile])

    /**
     * Limpia el archivo capturado
     */
    const clearCapture = useCallback(() => {
        if (capturedFile) {
            revokePreviewUrl(capturedFile.preview)
            setCapturedFile(null)
        }
    }, [capturedFile])

    /**
     * Props para el componente de cámara
     */
    const cameraProps = {
        isOpen: isCameraOpen,
        onClose: closeCamera,
        onCapture: handleCapture,
        title: `Tomar foto para ${type}`,
        maxWidth: validationOptions.maxWidth,
        maxHeight: validationOptions.maxHeight,
        quality: 0.8,
    }

    return {
        // Estados
        isCameraOpen,
        capturedFile,
        hasCapturedFile: !!capturedFile,

        // Métodos
        openCamera,
        closeCamera,
        handleCapture,
        retakePhoto,
        clearCapture,

        // Props
        cameraProps
    }
}