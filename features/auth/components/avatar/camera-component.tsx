'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, X, RotateCcw, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CameraComponentProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
  title?: string
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export default function CameraComponent({
  isOpen,
  onClose,
  onCapture,
  title = "Tomar Foto",
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
}: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  // Obtener dispositivos de cámara disponibles
  const getMediaDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter(device => device.kind === 'videoinput')
      setDevices(videoDevices)
    } catch (error) {
      console.error('Error getting media devices:', error)
    }
  }, [])

  // Iniciar stream de la cámara
  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error starting camera:', error)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }, [facingMode])

  // Detener cámara
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  // Capturar foto
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = Math.min(video.videoWidth, maxWidth)
    canvas.height = Math.min(video.videoHeight, maxHeight)

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        stopCamera()
      }
    }, 'image/jpeg', quality)
  }, [maxWidth, maxHeight, quality, stopCamera])

  // Confirmar y enviar foto
  const confirmPhoto = useCallback(() => {
    if (!canvasRef.current || !capturedImage) return

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const fileName = `camera_photo_${Date.now()}.jpg`
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        onCapture(file)
        handleClose()
      }
    }, 'image/jpeg', quality)
  }, [capturedImage, onCapture, quality])

  // Retomar foto
  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
      setCapturedImage(null)
    }
    startCamera()
  }, [capturedImage, startCamera])

  // Cambiar cámara
  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  // Cerrar modal
  const handleClose = useCallback(() => {
    stopCamera()
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
      setCapturedImage(null)
    }
    setError(null)
    onClose()
  }, [stopCamera, capturedImage, onClose])

  // Efectos
  useEffect(() => {
    if (isOpen) {
      getMediaDevices()
    }
  }, [isOpen, getMediaDevices])

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera()
    }
    
    return () => {
      stopCamera()
    }
  }, [isOpen, capturedImage, startCamera, stopCamera])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Camera Area */}
        <div className="relative bg-black aspect-video mx-6 rounded-lg overflow-hidden flex items-center justify-center">
          {error ? (
            <div className="text-center text-white p-8">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Error de Cámara</p>
              <p className="text-sm text-gray-300 mb-4">{error}</p>
              <Button onClick={startCamera} variant="secondary">
                Reintentar
              </Button>
            </div>
          ) : capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                className="max-w-full max-h-full object-contain"
                playsInline
                muted
              />
              
              {/* Loading overlay */}
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <p>Iniciando cámara...</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Camera switch button */}
          {devices.length > 1 && isStreaming && !capturedImage && (
            <Button
              onClick={switchCamera}
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="p-6">
          {capturedImage ? (
            <div className="flex justify-center gap-3">
              <Button onClick={retakePhoto} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retomar
              </Button>
              <Button onClick={confirmPhoto}>
                <Check className="w-4 h-4 mr-2" />
                Usar Foto
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                onClick={capturePhoto}
                disabled={!isStreaming}
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Tomar Foto
              </Button>
            </div>
          )}
          
          <p className="text-center text-muted-foreground text-sm mt-4">
            {capturedImage 
              ? "Revisa tu foto y confirma si te gusta" 
              : "Posiciona el objeto y presiona para tomar la foto"
            }
          </p>
        </div>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}