import { useEffect } from "react";
import { useAccountDeletion } from "../../hooks/use-account-deletion";
import { AccountDeletedAlert, ActionNearExpirationAlert, ExplanationAlert, NearExpirationAlert } from "./account-delete-alert";
import {MainCountdownDisplay } from "./main-countdown-display";
import { useCountdown } from "../../hooks/use-countdown";
import DeletionHelpers from "../../utils/deletion-helpers";

export default function DeletionCountdown({
    displayScheduledDate,
    timeRemaining, // ← AÑADIR AQUÍ
    canCancelUntil,
    isWithinActionWindow, // ← TAMBIÉN AÑADIR ESTA
    onAccountDeleted
}: {
    displayScheduledDate: Date;
    timeRemaining: number | null;
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

    // ✅ USAR DeletionHelpers con el método correcto
    const actionUrgency = actionTimeLeft 
        ? DeletionHelpers.getUrgencyLevelFromMinutes(actionTimeLeft.totalMinutes)
        : 'critical';
    const actionColors = DeletionHelpers.getUrgencyColors(actionUrgency);

    return (
        <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6 mb-6 space-y-6">
            {isNearExpiration && <NearExpirationAlert />}
            <MainCountdownDisplay
                timeLeft={timeLeft}
                scheduledDate={displayScheduledDate}
            />

            <ExplanationAlert />
        </div>
    );
}