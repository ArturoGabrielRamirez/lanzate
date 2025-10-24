'use client'

import {/*  Smartphone, *//*  Upload, */ Loader2, Check, Camera } from "lucide-react"
import { useState, useRef } from 'react'
import { toast } from "sonner"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { Button } from "@/features/shadcn/components/ui/button"
import { Label } from "@/features/shadcn/components/ui/label"
import { StoreLogoOption, StoreLogoInlineEditorProps } from '@/features/stores/types'
import { cn } from "@/lib/utils"

function StoreLogoInlineEditor({ currentLogo, storeName, onLogoUpdate }: StoreLogoInlineEditorProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [/* selectedFile, *//*  setSelectedFile */] = useState<File | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [logoOptions, setLogoOptions] = useState<StoreLogoOption[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentLogoUrl, /* setCurrentLogoUrl */] = useState<string | null>(currentLogo)
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log(onLogoUpdate)

  /*  const camera = useCamera({
     uploadPath: 'store-logos',
     onSuccess: (url) => {
       onLogoUpdate(url)
       resetState()
     },
     onError: (error) => {
       console.error('Camera upload error:', error)
       toast.error('Error al subir la foto')
     },
     quality: 0.9
   }) */

  function getDefaultLogo() {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(storeName)}&backgroundColor=transparent`
  }

  async function loadLogoOptions() {
    setIsLoadingOptions(true)
    try {
      const diceBearStyles = [
        { style: 'initials', label: 'Iniciales', icon: '🔤' },
        { style: 'identicon', label: 'Identicon', icon: '🔷' },
        { style: 'shapes', label: 'Formas', icon: '🔵' },
        { style: 'rings', label: 'Anillos', icon: '💍' },
        { style: 'icons', label: 'Iconos', icon: '🔰' },
        { style: 'bottts', label: 'Robot', icon: '🤖' },
        { style: 'avataaars', label: 'Avataaars', icon: '👤' },
        { style: 'personas', label: 'Personas', icon: '👨' },
        { style: 'pixel-art', label: 'Pixel Art', icon: '🎮' },
        { style: 'lorelei', label: 'Lorelei', icon: '🧝‍♀' }
      ]

      const options: StoreLogoOption[] = []
      for (const { style, label, icon } of diceBearStyles) {
        const diceBearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(storeName)}&backgroundColor=transparent`
        options.push({ id: `dicebear-${style}`, url: diceBearUrl, provider: 'DiceBear', label: `${label} Generado`, icon, isCurrentlyUsed: currentLogo === diceBearUrl })
      }

      if (currentLogo && !options.find(opt => opt.url === currentLogo)) {
        options.unshift({ id: 'current-logo', url: currentLogo, provider: 'Actual', label: 'Logo Actual', icon: '🏪', isCurrentlyUsed: true })
      }

      setLogoOptions(options)
    } catch (error) {
      console.error('Error loading logo options:', error)
      toast.error('Error cargando opciones de logo')
      setLogoOptions([{ id: 'dicebear-initials', url: getDefaultLogo(), provider: 'DiceBear', label: 'Iniciales Generadas', icon: '🔤', isCurrentlyUsed: currentLogo === getDefaultLogo() }])
    } finally {
      setIsLoadingOptions(false)
    }
  }
  /* 
    function resetState() {
      setSelectedFile(null)
      setSelectedOption(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } */

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no soportado. Usa JPG, PNG, GIF o WebP')
      return
    }

/*     setSelectedFile(file) */
    setSelectedOption(null)

    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.onerror = () => {
      console.error('Error leyendo archivo')
      toast.error('Error al leer el archivo')
    }
    reader.readAsDataURL(file)
  }

  function handleOptionSelect(optionId: string) {
    setSelectedOption(optionId)
/*     setSelectedFile(null) */
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /*   function handleUseSelectedOption() {
      const option = logoOptions.find(opt => opt.id === selectedOption)
      if (option) {
        onLogoUpdate(option.url)
        resetState()
        toast.success('Logo actualizado correctamente')
      }
    } */

  /*  async function handleUpload() {
     if (!selectedFile) {
       toast.error('No hay archivo seleccionado')
       return
     }
     try {
       const formData = new FormData()
       formData.append('file', selectedFile)
       formData.append('type', 'store-logo')
 
       const response = await fetch('/api/store-logo', { method: 'POST', body: formData })
       if (!response.ok) throw new Error('Error uploading file')
       const data = await response.json()
       onLogoUpdate(data.url)
       resetState()
       toast.success('Logo subido correctamente')
     } catch (error) {
       console.error('Upload error:', error)
       toast.error('Error al subir el archivo')
     }
   }
  */
  function getCurrentPreview() {
    if (previewUrl) return previewUrl
    if (selectedOption) {
      const option = logoOptions.find(opt => opt.id === selectedOption)
      return option?.url || getDefaultLogo()
    }
    return currentLogoUrl || getDefaultLogo()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <img src={getCurrentPreview()} alt="Store logo preview" className="size-24 rounded-full object-cover border-2 border-muted" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full bg-background border-2 border-background shadow-md hover:bg-accent"
            onClick={() => { const next = !showEditor; setShowEditor(next); if (next && logoOptions.length === 0) loadLogoOptions() }}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showEditor && (
        <>
          {/*           {camera.capturedFile && (
                  //useCamera calls onSuccess estaba comentado en el onClick del segundo boton
            <div className="p-4 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Foto capturada lista para usar</p>
                <div className="flex justify-center gap-2">
                  <Button type="button" onClick={camera.retakePhoto} variant="outline" size="sm">
                    <Smartphone className="h-4 w-4 mr-2" /> Retomar
                  </Button>
                  <Button type="button" onClick={async () => { await camera.uploadPhoto();  }} disabled={camera.isUploading} size="sm">
                    {camera.isUploading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Subiendo...</>) : 'Usar como Logo'}
                  </Button>
                  <Button type="button" onClick={camera.discardPhoto} variant="destructive" size="sm">Descartar</Button>
                </div>
              </div>
            </div>
          )} */}



          <Accordion type="single" collapsible>
            <AccordionItem value="logos-sugeridos">
              <AccordionTrigger>Logos sugeridos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <Label>Logos sugeridos</Label>
                  {isLoadingOptions ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {logoOptions.map((option) => (
                        <div key={option.id} className={cn("relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:bg-accent", selectedOption === option.id ? "border-primary bg-accent" : "border-muted")} onClick={() => handleOptionSelect(option.id)}>
                          <div className="flex flex-col items-center gap-2">
                            <img src={option.url} alt={`${option.provider} logo`} className="h-12 w-12 rounded-full object-cover" />
                            <div className="text-center">
                              <p className="text-xs font-medium">{option.label}</p>
                              <p className="text-xs text-muted-foreground">{option.provider}</p>
                            </div>
                            {selectedOption === option.id && (
                              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isLoadingOptions && logoOptions.length === 0 && (
                    <Button variant="ghost" size="sm" onClick={loadLogoOptions}>Cargar opciones sugeridas</Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="space-y-3">
            {/* <Label>Subir imagen</Label> */}
            <div className="flex gap-2">
      {/*         <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1" disabled={camera.isUploading}>
                <Upload className="h-4 w-4 mr-2" /> Seleccionar archivo
              </Button> */}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>
          {/* {!camera.capturedFile && (
            <div className="flex gap-2">
              <Button type="button" onClick={() => { camera.openCamera(); }} variant="outline" className="flex-1" disabled={camera.isUploading}>
                <Smartphone className="h-4 w-4 mr-2" /> Tomar Foto
              </Button>
            </div>
          )} */}
          {/*   <div className="flex gap-2">
            <Button type="button" onClick={() => { handleUseSelectedOption(); const option = logoOptions.find(o => o.id === selectedOption); if (option) { setCurrentLogoUrl(option.url); onLogoUpdate(option.url) } }} disabled={!selectedOption || camera.isUploading} className="flex-1">Usar Logo Seleccionado</Button>
            <Button type="button" onClick={async () => { await handleUpload(); if (previewUrl) { setCurrentLogoUrl(previewUrl) } }} disabled={!selectedFile || camera.isUploading} variant="outline" className="flex-1">Subir Archivo</Button>
          </div> */}

        </>
      )}
    </div>
  )
}


export { StoreLogoInlineEditor }