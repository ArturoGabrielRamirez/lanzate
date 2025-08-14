import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, X } from "lucide-react";

export default function CancelDeletionModal({
    isOpen,
    onClose,
    onConfirm,
    cancelReason,
    setCancelReason,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cancelReason: string;
    setCancelReason: (value: string) => void;
    isLoading: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">

                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-blue-400">Cancelar eliminación</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
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
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            Cerrar
                        </Button>
                        <Button
                            onClick={onConfirm}
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
};