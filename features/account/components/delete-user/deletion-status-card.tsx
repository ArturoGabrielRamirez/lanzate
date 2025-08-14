import { AlertTriangle, ShieldUser } from "lucide-react";
import { UserDeletionStatus } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DeletionStatusCard({
    status,
    onCancelClick
}: {
    status: UserDeletionStatus;
    onCancelClick: () => void;
}) {
    return (
        <div className="bg-gray-800 border border-orange-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-orange-400 text-lg">Estado de eliminación</h3>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Estado:</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Eliminación programada
                    </Badge>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Solicitada:</span>
                    <span className="text-gray-400">
                        {status.deletionRequestedAt &&
                            new Date(status.deletionRequestedAt).toLocaleString('es-ES')}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Programada para:</span>
                    <span className="text-gray-400">
                        {status.deletionScheduledAt &&
                            new Date(status.deletionScheduledAt).toLocaleString('es-ES')}
                    </span>
                </div>

                {status.deletionReason && (
                    <div className="pt-2">
                        <span className="text-gray-300 font-medium block mb-2">Motivo:</span>
                        <Alert className="bg-gray-900/50 border-gray-600">
                            <AlertDescription className="text-gray-300">
                                {status.deletionReason}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

            {status.canCancel && (
                <Button
                    onClick={onCancelClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <ShieldUser className="h-4 w-4 mr-2" />
                    Cancelar eliminación
                </Button>
            )}
        </div>
    );
}