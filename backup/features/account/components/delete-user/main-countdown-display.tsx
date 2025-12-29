import { Clock } from "lucide-react"

import { TimeBlock } from "@/features/account/components/delete-user/index"
import { CountdownDisplayProps, } from "@/features/account/types/index"

export function MainCountdownDisplay({
    timeLeft,
    scheduledDate,
    urgencyTextColor = 'text-red-400'
}: CountdownDisplayProps) {

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Clock className={`h-4 w-4 ${urgencyTextColor}`} />
                <h3 className={`font-medium ${urgencyTextColor}`}>
                    Tiempo hasta la Eliminación Final
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <TimeBlock
                    value={timeLeft.days}
                    label="Días"
                    urgencyTextColor={urgencyTextColor}
                    isMain={true}
                />
                <TimeBlock
                    value={timeLeft.hours}
                    label="Horas"
                    urgencyTextColor={urgencyTextColor}
                />
                <TimeBlock
                    value={timeLeft.minutes}
                    label="Minutos"
                    urgencyTextColor={urgencyTextColor}
                />
                <TimeBlock
                    value={timeLeft.seconds}
                    label="Segundos"
                    urgencyTextColor={urgencyTextColor}
                />
            </div>

            <div className="text-center p-3 bg-gray-900/30 rounded border border-gray-700">
                <p className="text-xs text-gray-300">
                    Eliminación:{' '}
                    <span className={`font-medium ${urgencyTextColor}`}>
                        {scheduledDate.toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </p>
            </div>
        </div>
    );
}