import { Button } from "@/components/ui/button";
import { ProgressButtonProps } from "@/features/auth/types";

function ProgressButton({
    hasPendingChange,
    isProcessCompleted,
    progressText,
    onShowMonitor
}: ProgressButtonProps) {
    if (!hasPendingChange) return null;

    return (
        <Button
            variant={isProcessCompleted ? "default" : "outline"}
            size="sm"
            onClick={onShowMonitor}
            className="text-xs whitespace-nowrap flex items-center gap-1"
        >
            {progressText}
        </Button>
    );
}

export { ProgressButton };