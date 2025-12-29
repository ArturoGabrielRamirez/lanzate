import { ResendButtonProps } from "@/features/auth/types"
import { Button } from "@/features/shadcn/components/ui/button";


export function ResendButton({ isResending, cooldownTime, onResend }: ResendButtonProps) {
    const getButtonText = () => {
        if (isResending) return 'Reenviando...';
        if (cooldownTime > 0) return `${cooldownTime}s para solicitar nuevamente`;
        return 'Reenviar email';
    };

    const isButtonDisabled = isResending || cooldownTime > 0;

    const getButtonClassName = () => {
        const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all w-full';

        if (cooldownTime > 0) {
            return `${baseClasses} bg-yellow-600 text-gray-300 cursor-not-allowed`;
        }

        if (isResending) {
            return `${baseClasses} bg-secondary-foreground text-white cursor-not-allowed`;
        }

        return `${baseClasses} bg-gradient-to-t from-chart-5 to-primary hover:bg-chart-1 text-white hover:scale-105`;
    };

    return (
        <>
            <Button
                onClick={onResend}
                disabled={isButtonDisabled}
                className={getButtonClassName()}
            >
                {getButtonText()}
            </Button>

            {cooldownTime > 0 && (
                <p className="text-sm text-yellow-400 mt-2">
                    Puedes reenviar en {cooldownTime} segundos
                </p>
            )}
        </>
    );
}