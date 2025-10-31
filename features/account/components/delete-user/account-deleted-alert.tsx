import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"

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