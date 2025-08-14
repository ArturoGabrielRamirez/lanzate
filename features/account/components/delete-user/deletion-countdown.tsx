"use client";

import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function DeletionCountdown({ 
    scheduledDate, 
    timeRemaining 
}: {
    scheduledDate: Date;
    timeRemaining: number | null;
}) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!timeRemaining || timeRemaining <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(scheduledDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [scheduledDate, timeRemaining]);

    return (
        <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-red-400 text-lg">
                    Tiempo restante para eliminación
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                        {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Días
                    </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                        {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Horas
                    </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Minutos
                    </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        Segundos
                    </div>
                </div>
            </div>

            <div className="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">
                    Eliminación programada para:{' '}
                    <span className="font-semibold text-red-400">
                        {new Date(scheduledDate).toLocaleString('es-ES', {
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