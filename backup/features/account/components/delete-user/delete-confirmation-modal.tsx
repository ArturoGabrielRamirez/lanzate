import { AlertTriangle, X } from "lucide-react"
import { useState, useEffect } from "react"

import { validators, DELETION_CONSTANTS } from "@/features/account/utils/utils"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import { Input } from "@/features/shadcn/components/ui/input"
import { Label } from "@/features/shadcn/components/ui/label"
import { Textarea } from "@/features/shadcn/components/ui/textarea"

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    reason,
    setReason,
    password,
    setPassword,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    reason: string;
    setReason: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoading: boolean;
}) {
    const [errors, setErrors] = useState<{ reason?: string; password?: string }>({});

    // Manejar ESC para cerrar el modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                e.preventDefault();
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        const reasonValidation = validators.deletionReason(reason);
        const passwordValidation = validators.password(password);

        const newErrors: { reason?: string; password?: string } = {};

        if (!reasonValidation.isValid) {
            newErrors.reason = reasonValidation.error;
        }
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await onConfirm();
            } catch (error) {
                console.error('Error en confirmación:', error);
            }
        }
    };

    const handleReasonChange = (value: string) => {
        setReason(value);
        if (errors.reason) {
            setErrors(prev => ({ ...prev, reason: undefined }));
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    };

    // Cerrar al hacer click fuera del modal (backdrop)
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
                    <h3 className="text-lg font-semibold text-red-400">
                        Confirmar eliminación de cuenta
                    </h3>
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
                    <Alert className="bg-red-500/10 border-red-500/30">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400">
                            <span className="font-semibold">¡Atención!</span>{' '}
                            Esta acción no se puede deshacer. Tu cuenta y todos tus datos
                            serán eliminados permanentemente después de {DELETION_CONSTANTS.GRACE_PERIOD_DAYS} días.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-gray-300">
                            Motivo de eliminación *
                        </Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => handleReasonChange(e.target.value)}
                            placeholder="Explica brevemente por qué deseas eliminar tu cuenta..."
                            className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-red-400 ${errors.reason ? 'border-red-500' : ''
                                }`}
                            rows={3}
                            minLength={DELETION_CONSTANTS.MIN_REASON_LENGTH}
                            disabled={isLoading}
                        />
                        {errors.reason && (
                            <p className="text-red-400 text-sm">{errors.reason}</p>
                        )}
                        <p className="text-gray-400 text-xs">
                            Mínimo {DELETION_CONSTANTS.MIN_REASON_LENGTH} caracteres ({reason.length}/{DELETION_CONSTANTS.MIN_REASON_LENGTH})
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">
                            Confirmá tu contraseña *
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="Ingresa tu contraseña actual"
                            className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 ${errors.password ? 'border-red-500' : ''
                                }`}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-300 text-sm">
                            💡 <span className="font-semibold">Período de gracia:</span> Vas a tenér {DELETION_CONSTANTS.GRACE_PERIOD_DAYS} días
                            para cambiar de opinión y cancelar la eliminación.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            disabled={isLoading}
                        >
                            Cancelar <span className="ml-2 text-xs opacity-70">(Esc)</span>
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isLoading ? 'Procesando...' : 'Eliminar cuenta'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}