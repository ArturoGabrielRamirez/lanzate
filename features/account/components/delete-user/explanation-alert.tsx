import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert";

export function ExplanationAlert() {
    return (
        <div className="border-t border-gray-700 pt-4">
            <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertDescription className="text-blue-300 text-sm">
                    <strong>Explicación:</strong> La `&quot;`Ventana de Acción`&quot;` es el tiempo límite para cancelar o modificar tu solicitud de eliminación.
                    Una vez que expire, la eliminación se procesará automáticamente en la fecha programada.
                </AlertDescription>
            </Alert>
        </div>
    );
}