'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, User } from "lucide-react"
import { AvatarEditorProps } from '../types'
import { useAvatarEditor } from '../hooks/use-avatar-editor'
import { ActionButtons, AvatarOptions, AvatarPreview, FileUploadSection } from './index'

export default function AvatarEditor({ currentAvatar, userEmail, onAvatarUpdate }: AvatarEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isUploading,
    isLoadingOptions,
  /*   previewUrl, */
    selectedFile,
    selectedOption,
    avatarOptions,
/*     setSelectedFile,
    setSelectedOption,
    setPreviewUrl, */
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

  useEffect(() => {
    if (isOpen) {
      loadAvatarOptions()
    }
  }, [isOpen, loadAvatarOptions])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full bg-background border-2 border-background shadow-md hover:bg-accent"
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
            previewUrl={getCurrentPreview()}
            getDefaultAvatar={getDefaultAvatar}
          />

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
            isUploading={isUploading}
            onUseSelectedOption={useSelectedOption}
            onUpload={handleUpload}
            onRemoveAvatar={removeAvatar}
            onCancel={() => {
              setIsOpen(false)
              resetState()
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}