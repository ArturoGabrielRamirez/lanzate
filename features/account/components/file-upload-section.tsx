import { forwardRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { FileUploadSectionProps } from '../types'

export const FileUploadSection = forwardRef<HTMLInputElement, FileUploadSectionProps>(
    ({ onFileSelect, onButtonClick }, ref) => {
        return (
            <div className="space-y-3">
                <Label htmlFor="avatar-upload">O subir imagen personalizada</Label>
                <div className="flex gap-2">
                    <Input
                        ref={ref}
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={onFileSelect}
                        className="flex-1"
                    />
                    <Button
                        onClick={onButtonClick}
                        variant="outline"
                        size="icon"
                    >
                        <Upload className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Formatos: JPG, PNG, GIF. Máximo 5MB.
                </p>
            </div>
        )
    }
)

FileUploadSection.displayName = 'FileUploadSection'