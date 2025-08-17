import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function AccountDeletedAlert() {
    return (
        <div className="bg-gray-800 border border-red-500 rounded-lg p-6 mb-6">
            <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <AlertDescription className="text-red-400 font-medium">
                    Tu cuenta ha sido eliminada permanentemente.
                    Serás redirigido automáticamente en unos momentos...
                </AlertDescription>
            </Alert>

            <div className="mt-4 text-center">
                <Button
                    onClick={() => window.location.href = '/login'}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                    Ir a Inicio de Sesión
                </Button>
            </div>
        </div>
    );
}

export function NearExpirationAlert() {
    return (
        <Alert className="bg-red-500/10 border-red-500/30 mt-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
                ⚠️ <strong>¡Eliminación inminente!</strong> Tu cuenta será eliminada en menos de 5 minutos.
            </AlertDescription>
        </Alert>
    );
}

export function ActionNearExpirationAlert({ totalMinutes }: { totalMinutes: number }) {
    return (
        <Alert className="bg-red-500/10 border-red-500/30 mt-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
                ⚠️ <strong>¡Últimos minutos!</strong> La ventana para cancelar cierra en {totalMinutes} minutos.
            </AlertDescription>
        </Alert>
    );
}

export function ExplanationAlert() {
    return (
        <div className="border-t border-gray-700 pt-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertDescription className="text-blue-300 text-sm">
                    <strong>Explicación:</strong> La "Ventana de Acción" es el tiempo límite para cancelar o modificar tu solicitud de eliminación.
                    Una vez que expire, la eliminación se procesará automáticamente en la fecha programada.
                </AlertDescription>
            </Alert>
        </div>
    );
}