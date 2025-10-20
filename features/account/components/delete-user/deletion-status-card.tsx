import { AlertTriangle, ShieldUser, Clock } from "lucide-react";

import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert";
import { Badge } from "@/features/shadcn/components/ui/badge";
import { Button } from "@/features/shadcn/components/ui/button";
import { UserDeletionStatus } from "@/features/account/types/index";
import { getUrgencyLevel, getUrgencyLevelFromMinutes } from "@/features/account/utils/deletion-helpers";

export function DeletionStatusCard({
    status,
    onCancelClick,
   /*  scheduledDate */
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
    scheduledDate: Date | null;
}) {

    const canActuallyCancelNow = status.canCancel;

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

    const deletionUrgency = getUrgencyLevel(status.daysRemaining || 0);
    const actionUrgency = timeUntilLimit ? getUrgencyLevelFromMinutes(timeUntilLimit.totalMinutes) : 'critical';

    const getUrgencyColors = (urgency: string) => {
        switch (urgency) {
            case 'critical':
                return {
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    bg: 'bg-red-500/10',
                    icon: 'text-red-400'
                };
            case 'high':
                return {
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    bg: 'bg-red-500/10',
                    icon: 'text-red-400'
                };
            case 'medium':
                return {
                    text: 'text-orange-400',
                    border: 'border-orange-500/30',
                    bg: 'bg-orange-500/10',
                    icon: 'text-orange-400'
                };
            case 'low':
                return {
                    text: 'text-yellow-400',
                    border: 'border-yellow-500/30',
                    bg: 'bg-yellow-500/10',
                    icon: 'text-yellow-400'
                };
            default:
                return {
                    text: 'text-orange-400',
                    border: 'border-orange-500/30',
                    bg: 'bg-orange-500/10',
                    icon: 'text-orange-400'
                };
        }
    };

    const urgencyColors = getUrgencyColors(deletionUrgency);
    const actionColors = getUrgencyColors(actionUrgency);

    return (
        <div className={`${urgencyColors.bg} border rounded-lg p-4 ${urgencyColors.border}`}>
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={`h-4 w-4 ${urgencyColors.icon}`} />
                <h3 className={`font-medium ${urgencyColors.text}`}>Estado de eliminación</h3>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Estado:</span>
                    <Badge className={`${urgencyColors.bg} ${urgencyColors.text} ${urgencyColors.border} border text-xs`}>
                        Eliminación programada
                    </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Solicitada:</span>
                    <span className="text-gray-400 text-xs">
                        {status.deletionRequestedAt &&
                            new Date(status.deletionRequestedAt).toLocaleDateString('es-ES')}
                    </span>
                </div>

                {timeUntilLimit && (timeUntilLimit.totalMinutes <= 60 || status.isWithinActionWindow) && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Tiempo restante:</span>
                        <span className={`font-mono font-bold ${actionColors.text}`}>
                            {timeUntilLimit.minutes}:{timeUntilLimit.seconds.toString().padStart(2, '0')}
                        </span>
                    </div>
                )}

                {status.deletionReason && (
                    <div className="pt-2">
                        <span className="text-gray-300 text-sm block mb-1">Motivo:</span>
                        <div className="bg-gray-900/50 border border-gray-600 rounded p-2">
                            <p className="text-gray-300 text-xs">
                                {status.deletionReason}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={onCancelClick}
                disabled={!canActuallyCancelNow}
                size="sm"
                className={`w-full ${canActuallyCancelNow
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <ShieldUser className="h-3 w-3 mr-1" />
                {canActuallyCancelNow ? 'Cancelar eliminación' : 'Período expirado'}
            </Button>

            {status.isWithinActionWindow && canActuallyCancelNow && (
                <Alert className={`${actionColors.bg} ${actionColors.border} mt-2`}>
                    <Clock className={`h-3 w-3 ${actionColors.icon}`} />
                    <AlertDescription className="text-gray-300 text-xs">
                        <span className={`font-medium ${actionColors.text}`}>⚠️ Últimos minutos:</span>{' '}
                        La eliminación es inminente. Actúa ahora si quieres cancelar.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}