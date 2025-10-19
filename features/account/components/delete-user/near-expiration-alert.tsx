import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

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