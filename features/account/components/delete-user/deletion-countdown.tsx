import { useEffect } from "react";
import { getUrgencyLevel, getUrgencyColors } from "../../utils/utils";
import { useAccountDeletion } from "../../hooks/use-account-deletion";
import { AccountDeletedAlert, ActionNearExpirationAlert, ExplanationAlert, NearExpirationAlert } from "./account-delete-alert";
import { ActionCountdownDisplay, MainCountdownDisplay } from "./main-countdown-display";
import { useCountdown } from "../../hooks/use-countdown";


export default function DeletionCountdown({
    displayScheduledDate,
    canCancelUntil,
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

    const actionUrgency = actionTimeLeft ? getUrgencyLevel(actionTimeLeft.totalMinutes) : 'expired';
    const actionColors = getUrgencyColors(actionUrgency);

    return (
        <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6 mb-6 space-y-6">
            {canCancelUntil && (
                <>
                    <ActionCountdownDisplay
                        actionTimeLeft={actionTimeLeft}
                        canCancelUntil={canCancelUntil}
                        urgencyColors={actionColors}
                    />
                    {isActionNearExpiration && actionTimeLeft && (
                        <ActionNearExpirationAlert totalMinutes={actionTimeLeft.totalMinutes} />
                    )}
                </>
            )}

            <MainCountdownDisplay
                timeLeft={timeLeft}
                scheduledDate={displayScheduledDate}
            />

            {isNearExpiration && <NearExpirationAlert />}

            <ExplanationAlert />
        </div>
    );
}
