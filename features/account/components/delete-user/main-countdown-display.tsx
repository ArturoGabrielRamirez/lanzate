import { Clock, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface ActionTimeLeft {
    minutes: number;
    seconds: number;
    totalMinutes: number;
}

interface CountdownDisplayProps {
    timeLeft: TimeLeft;
    scheduledDate: Date;
    title?: string;
    variant?: 'main' | 'action';
    urgencyColors?: {
        bg: string;
        text: string;
        border: string;
    };
}

interface ActionCountdownDisplayProps {
    actionTimeLeft: ActionTimeLeft | null;
    canCancelUntil: Date;
    urgencyColors: {
        bg: string;
        text: string;
        border: string;
    };
}

export function MainCountdownDisplay({ 
    timeLeft, 
    scheduledDate 
}: CountdownDisplayProps) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-red-400 text-lg">
                    Tiempo hasta Eliminación Final
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <TimeBlock value={timeLeft.days} label="Días" />
                <TimeBlock value={timeLeft.hours} label="Horas" />
                <TimeBlock value={timeLeft.minutes} label="Minutos" />
                <TimeBlock value={timeLeft.seconds} label="Segundos" />
            </div>

            <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                    Eliminación programada para:{' '}
                    <span className="font-semibold text-red-400">
                        {scheduledDate.toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </p>
            </div>
        </div>
    );
}

/* export function ActionCountdownDisplay({ 
    actionTimeLeft, 
    canCancelUntil, 
    urgencyColors 
}: ActionCountdownDisplayProps) {
    return (
        <div className="border-b border-gray-700 pb-6">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${urgencyColors.bg} rounded-lg`}>
                    <Timer className={`h-5 w-5 ${urgencyColors.text}`} />
                </div>
                <h3 className={`font-semibold ${urgencyColors.text} text-lg`}>
                    Ventana de Acción
                </h3>
                <Badge className={`${urgencyColors.bg} ${urgencyColors.text} ${urgencyColors.border}`}>
                    {actionTimeLeft ? 'ACTIVA' : 'EXPIRADA'}
                </Badge>
            </div>

            {actionTimeLeft ? (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <ActionTimeBlock 
                        value={actionTimeLeft.minutes} 
                        label="Minutos"
                        urgencyColors={urgencyColors}
                    />
                    <ActionTimeBlock 
                        value={actionTimeLeft.seconds} 
                        label="Segundos"
                        urgencyColors={urgencyColors}
                    />
                </div>
            ) : (
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">
                        La ventana para cancelar o modificar la eliminación ha expirado.
                        Tu cuenta se procesará automáticamente según lo programado.
                    </p>
                </div>
            )}

            <div className="text-center p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                    Puedes actuar hasta:{' '}
                    <span className={`font-semibold ${urgencyColors.text}`}>
                        {canCancelUntil.toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </p>
            </div>
        </div>
    );
} */

function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-3xl font-bold text-red-400 mb-1">
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 font-medium">
                {label}
            </div>
        </div>
    );
}

/* function ActionTimeBlock({ 
    value, 
    label, 
    urgencyColors 
}: { 
    value: number; 
    label: string; 
    urgencyColors: { bg: string; text: string; border: string }; 
}) {
    return (
        <div className={`${urgencyColors.bg} rounded-lg p-4 text-center border ${urgencyColors.border}`}>
            <div className={`text-3xl font-bold ${urgencyColors.text} mb-1`}>
                {String(value).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 font-medium">
                {label}
            </div>
        </div>
    );
} */