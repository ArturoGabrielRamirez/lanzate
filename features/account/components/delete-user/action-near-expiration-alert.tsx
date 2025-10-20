import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"

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