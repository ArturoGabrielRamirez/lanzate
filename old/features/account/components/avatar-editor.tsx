'use client'

import { AvatarEditorProps } from '../types'
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from 'react'
import { Camera, User, Smartphone } from "lucide-react"
import { useAvatarEditor } from '../hooks/use-avatar-editor'
import { useCamera } from '@/features/auth/hooks/use-camera'
import CameraComponent from '@/features/auth/components/avatar/camera-component'
import { ActionButtons, AvatarOptions, AvatarPreview, FileUploadSection } from './index'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export default function AvatarEditor({ currentAvatar, userEmail, onAvatarUpdate }: AvatarEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isUploading,
    isLoadingOptions,
    selectedFile,
    selectedOption,
    avatarOptions,
    loadAvatarOptions,
    handleFileSelect,
    handleOptionSelect,
    handleUpload,
    useSelectedOption,
    removeAvatar,
    resetState,
    getCurrentPreview,
    getDefaultAvatar
  } = useAvatarEditor({
    currentAvatar,
    userEmail,
    onAvatarUpdate,
    fileInputRef,
    onClose: () => setIsOpen(false)
  })

  const camera = useCamera({
    uploadPath: 'avatar',
    onSuccess: (url) => {
      onAvatarUpdate(url)
      setIsOpen(false)
      resetState()
    },
    onError: (error) => {
      console.error('Camera upload error:', error)
    },
    quality: 0.9
  })

  useEffect(() => {
    if (isOpen) {
      loadAvatarOptions()
    }
  }, [isOpen, loadAvatarOptions])

  const getActualPreview = () => {
    if (camera.capturedFile) {
      return camera.capturedFile.preview
    }
    return getCurrentPreview()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full bg-primary"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cambiar foto de perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            <AvatarPreview
              previewUrl={getActualPreview()}
              getDefaultAvatar={getDefaultAvatar}
            />

            {camera.capturedFile && (
              <div className="p-4 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Foto capturada lista para usar
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={camera.retakePhoto}
                      variant="outline"
                      size="sm"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Retomar
                    </Button>
                    <Button
                      onClick={camera.uploadPhoto}
                      disabled={camera.isUploading}
                      size="sm"
                    >
                      {camera.isUploading ? 'Subiendo...' : 'Usar como Avatar'}
                    </Button>
                    <Button
                      onClick={camera.discardPhoto}
                      variant="destructive"
                      size="sm"
                    >
                      Descartar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!camera.capturedFile && (
              <div className="flex gap-2">
                <Button
                  onClick={camera.openCamera}
                  variant="outline"
                  className="flex-1"
                  disabled={camera.isUploading}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Tomar Foto
                </Button>
              </div>
            )}

            <AvatarOptions
              isLoading={isLoadingOptions}
              options={avatarOptions}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
            />

            <FileUploadSection
              ref={fileInputRef}
              onFileSelect={handleFileSelect}
              onButtonClick={() => fileInputRef.current?.click()}
            />

            <ActionButtons
              selectedOption={selectedOption}
              selectedFile={selectedFile}
              currentAvatar={currentAvatar}
              isUploading={isUploading || camera.isUploading}
              onUseSelectedOption={useSelectedOption}
              onUpload={handleUpload}
              onRemoveAvatar={removeAvatar}
              onCancel={() => {
                setIsOpen(false)
                resetState()
                camera.discardPhoto()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CameraComponent
        {...camera.cameraProps}
        title="Tomar Foto para Avatar"
      />
    </>
  )
}