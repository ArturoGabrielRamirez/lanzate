import { CheckCircle, X } from "lucide-react"
import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook" // 💡 Importamos useHotkeys

import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import { Label } from "@/features/shadcn/components/ui/label"
import { Textarea } from "@/features/shadcn/components/ui/textarea"

export function CancelDeletionModal({
    isOpen,
    onClose,
    onConfirm,
    cancelReason,
    setCancelReason,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    cancelReason: string;
    setCancelReason: (value: string) => void;
    isLoading: boolean;
}) {
    // Mantenemos el useEffect para la gestión de scroll del body, que no es parte del hook.
    useEffect(() => {
        if (isOpen) {
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 💡 Implementación de useHotkeys
    // 1. Manejar Escape para cerrar
    useHotkeys('esc', (e) => {
        e.preventDefault();
        if (!isLoading) {
            onClose();
        }
    }, { 
        enabled: isOpen, // Solo activo si el modal está abierto
        enableOnFormTags: true, // Debe funcionar incluso si se escribe en el Textarea
    }, [isOpen, isLoading, onClose]);

    // 2. Manejar Enter para confirmar (acción por defecto del formulario en un modal)
    // También agregamos Ctrl/Cmd + Enter como alternativa robusta para formularios
    useHotkeys('enter, ctrl+enter, cmd+enter', (e) => {
        e.preventDefault();
        if (!isLoading) {
            handleConfirm();
        }
    }, { 
        enabled: isOpen, // Solo activo si el modal está abierto
        enableOnFormTags: true,
        // Opcional: Desactivar si el focus está específicamente en el Textarea
        // filter: (e) => e.target.id !== 'cancelReason', 
    }, [isOpen, isLoading, onConfirm]);
    
    // ----------------------------------------------------

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            console.error('Error en confirmación:', error);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-blue-400">Cancelar eliminación</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        disabled={isLoading}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-4">
                    <Alert className="bg-blue-500/10 border-blue-500/30">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <AlertDescription className="text-gray-300">
                            <span className="font-semibold text-blue-400">Cancelar eliminación:</span>{' '}
                            Podrás seguir usando tu cuenta normalmente.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="cancelReason" className="text-gray-300">
                            Motivo de cancelación (opcional)
                        </Label>
                        <Textarea
                            id="cancelReason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="¿Qué te hizo cambiar de opinión?"
                            className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-blue-400"
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            Cerrar <span className="ml-2 text-xs opacity-70">(Esc)</span>
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? 'Cancelando...' : 'Cancelar eliminación'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}