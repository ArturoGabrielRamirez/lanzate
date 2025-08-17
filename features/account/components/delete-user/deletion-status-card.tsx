import { AlertTriangle, ShieldUser, Clock, X } from "lucide-react";
import { UserDeletionStatus } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DeletionStatusCard({
    status,
    onCancelClick
}: {
    status: UserDeletionStatus & {
        canDeleteUntil?: Date | null;
        canCancelUntil?: Date | null;
        isWithinActionWindow?: boolean;
        calculationInfo?: {
            currentTime: string;
            roundedActionLimit: string | null;
            withinWindow: boolean;
        };
    };
    onCancelClick: () => void;
}) {

    const canActuallyCancelNow = status.isWithinActionWindow && status.canCancel;

    const getTimeUntilActionLimit = () => {
        if (!status.canCancelUntil) return null;

        const now = new Date();
        const limit = new Date(status.canCancelUntil);
        const diff = limit.getTime() - now.getTime();

        if (diff <= 0) return null;

        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { minutes, seconds, totalMinutes: minutes };
    };

    const timeUntilLimit = getTimeUntilActionLimit();

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
                        {status.canCancelUntil &&
                            new Date(status.canCancelUntil).toLocaleString('es-ES')}
                    </span>
                </div>

                {status.canCancelUntil && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Puedes actuar hasta:</span>
                        <span className="text-blue-400 font-medium">
                            {new Date(status.canCancelUntil).toLocaleString('es-ES')}
                        </span>
                    </div>
                )}

                {timeUntilLimit && timeUntilLimit.totalMinutes <= 30 && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-medium">Tiempo para actuar:</span>
                        <span className="text-yellow-400 font-mono">
                            {timeUntilLimit.minutes}:{timeUntilLimit.seconds.toString().padStart(2, '0')}
                        </span>
                    </div>
                )}

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

            <Button
                onClick={onCancelClick}
                disabled={!canActuallyCancelNow}
                className={`w-full ${canActuallyCancelNow
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <ShieldUser className="h-4 w-4 mr-2" />
                {canActuallyCancelNow ? 'Cancelar eliminación' : 'Período de cancelación expirado'}
            </Button>

            {!status.isWithinActionWindow && status.isDeletionRequested && (
                <Alert className="bg-red-500/10 border-red-500/30 mt-3">
                    <X className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-gray-300">
                        <span className="font-semibold text-red-400">Período expirado:</span>{' '}
                        La ventana para cancelar la eliminación ha cerrado. La cuenta se procesará automáticamente.
                    </AlertDescription>
                </Alert>
            )}

            {timeUntilLimit && timeUntilLimit.totalMinutes <= 10 && canActuallyCancelNow && (
                <Alert className="bg-yellow-500/10 border-yellow-500/30 mt-3">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-gray-300">
                        <span className="font-semibold text-yellow-400">¡Últimos minutos!</span>{' '}
                        Solo tienes {timeUntilLimit.minutes} minutos para cancelar la eliminación.
                    </AlertDescription>
                </Alert>
            )}

            {canActuallyCancelNow && (
                <Alert className="bg-blue-500/10 border-blue-500/30 mt-3">
                    <AlertDescription className="text-gray-300">
                        <span className="font-semibold text-blue-400">Recordatorio:</span>{' '}
                        Después de la ventana de acción, tu cuenta se eliminará automáticamente en {status.daysRemaining} días.
                    </AlertDescription>
                </Alert>
            )}

        </div>
    );
}