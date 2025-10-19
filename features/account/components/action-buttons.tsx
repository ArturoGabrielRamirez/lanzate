import { Button } from "@/components/ui/button"
import { Loader2, Check, Upload, X } from "lucide-react"
import { ActionButtonsProps } from "../types"

export function ActionButtons({
    selectedOption,
    selectedFile,
    currentAvatar,
    isUploading,
    onUseSelectedOption,
    onUpload,
    onRemoveAvatar,
    onCancel
}: ActionButtonsProps) {
    return (
        <div className="flex flex-col gap-2">
            {selectedOption && (
                <Button
                    onClick={onUseSelectedOption}
                    disabled={isUploading}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Usar esta imagen
                        </>
                    )}
                </Button>
            )}

            {selectedFile && (
                <Button
                    onClick={onUpload}
                    disabled={isUploading}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Subir imagen personalizada
                        </>
                    )}
                </Button>
            )}
            {currentAvatar && (
                <Button
                    onClick={onRemoveAvatar}
                    disabled={isUploading}
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Removiendo...
                        </>
                    ) : (
                        <>
                            <X className="mr-2 h-4 w-4" />
                            Remover foto
                        </>
                    )}
                </Button>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isUploading}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    )
}
