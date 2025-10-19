"use client"

import { Clock } from "lucide-react"
import { useEffect } from "react"

import { AccountDeletedAlert, ActionNearExpirationAlert, ExplanationAlert, NearExpirationAlert } from "@/features/account/components/delete-user/index"
import { MainCountdownDisplay } from "@/features/account/components/delete-user/main-countdown-display"
import { useAccountDeletion } from "@/features/account/hooks/use-account-deletion"
import { useCountdown } from "@/features/account/hooks/use-countdown"
import { getUrgencyLevel, getUrgencyLevelFromMinutes } from "@/features/account/utils/deletion-helpers"

export function DeletionCountdown({
    displayScheduledDate,
    canCancelUntil,
    isWithinActionWindow,
    onAccountDeleted
}: {
    displayScheduledDate: Date;
    canCancelUntil?: Date | null;
    isWithinActionWindow?: boolean;
    onAccountDeleted?: () => void;
}) {
    const {
        timeLeft,
        actionTimeLeft,
        isExpired,
        isNearExpiration,
        isActionNearExpiration
    } = useCountdown(displayScheduledDate, canCancelUntil);

    const {
        isDeleted,
        checkAccountStatus
    } = useAccountDeletion(onAccountDeleted);

    useEffect(() => {
        if (isExpired) {
            checkAccountStatus();
        }
    }, [isExpired, checkAccountStatus]);

    useEffect(() => {
        if (timeLeft.difference > 0 && timeLeft.difference < 10000) {
            checkAccountStatus();
        }
    }, [timeLeft.difference, checkAccountStatus]);

    if (isDeleted) {
        return <AccountDeletedAlert />;
    }

    const actionUrgency = actionTimeLeft
        ? getUrgencyLevelFromMinutes(actionTimeLeft.totalMinutes)
        : 'critical';

    const deletionUrgency = getUrgencyLevel(timeLeft.days || 0);

    const getUrgencyTextColor = (urgency: string) => {
        switch (urgency) {
            case 'critical': return 'text-red-400';
            case 'high': return 'text-red-400';
            case 'medium': return 'text-orange-400';
            case 'low': return 'text-yellow-400';
            default: return 'text-red-400';
        }
    };

    const getUrgencyBorderColor = (urgency: string) => {
        switch (urgency) {
            case 'critical': return 'border-red-500/30';
            case 'high': return 'border-red-500/30';
            case 'medium': return 'border-orange-500/30';
            case 'low': return 'border-yellow-500/30';
            default: return 'border-red-500/30';
        }
    };

    const deletionTextColor = getUrgencyTextColor(deletionUrgency);
    const deletionBorderColor = getUrgencyBorderColor(deletionUrgency);
    const actionTextColor = getUrgencyTextColor(actionUrgency);
    const actionBorderColor = getUrgencyBorderColor(actionUrgency);

    return (
        <div className={`bg-gray-800 border rounded-lg p-4 mb-4 space-y-4 ${deletionBorderColor}`}>
            {isNearExpiration && <NearExpirationAlert />}
            {isActionNearExpiration && actionTimeLeft && (
                <ActionNearExpirationAlert totalMinutes={actionTimeLeft.totalMinutes} />
            )}

            <MainCountdownDisplay
                timeLeft={timeLeft}
                scheduledDate={displayScheduledDate}
                urgencyTextColor={deletionTextColor}
            />

            {actionTimeLeft && isWithinActionWindow && (
                <div className={`p-3 rounded border bg-gray-900/50 ${actionBorderColor}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${actionTextColor}`} />
                            <span className={`text-sm font-medium ${actionTextColor}`}>
                                Ventana: {Math.floor(actionTimeLeft.totalMinutes / 60)}h {actionTimeLeft.totalMinutes % 60}m
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            {actionUrgency === 'critical' ? 'Crítico' :
                                actionUrgency === 'high' ? 'Urgente' :
                                    actionUrgency === 'medium' ? 'Activa' : 'Normal'}
                        </span>
                    </div>
                </div>
            )}
            <ExplanationAlert />
        </div>
    );
}