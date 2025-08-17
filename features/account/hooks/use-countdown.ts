import { useState, useEffect, useCallback, useRef } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    difference: number;
}

interface ActionTimeLeft {
    minutes: number;
    seconds: number;
    totalMinutes: number;
}

export function useCountdown(targetDate: Date, canCancelUntil?: Date | null) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        difference: 0
    });

    const [actionTimeLeft, setActionTimeLeft] = useState<ActionTimeLeft | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastUpdateRef = useRef<number>(0);

    const calculateTimeLeft = useCallback((target: Date): TimeLeft => {
        const now = Date.now();
        const targetTime = target.getTime();
        const difference = targetTime - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds, difference };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0, difference: 0 };
    }, []);

    const calculateActionTimeLeft = useCallback((cancelUntil: Date): ActionTimeLeft | null => {
        const now = Date.now();
        const target = cancelUntil.getTime();
        const difference = target - now;

        if (difference > 0) {
            const minutes = Math.floor(difference / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return { minutes, seconds, totalMinutes: minutes };
        }

        return null;
    }, []);

    const updateCountdowns = useCallback(() => {
        const now = Date.now();
        
        // Evitar actualizaciones muy frecuentes (mínimo 100ms entre updates)
        if (now - lastUpdateRef.current < 100) {
            return;
        }
        lastUpdateRef.current = now;

        const newTimeLeft = calculateTimeLeft(targetDate);
        const newActionTimeLeft = canCancelUntil ? calculateActionTimeLeft(canCancelUntil) : null;

        setTimeLeft(prev => {
            // Solo actualizar si hay cambio real en los valores
            if (
                prev.days !== newTimeLeft.days ||
                prev.hours !== newTimeLeft.hours ||
                prev.minutes !== newTimeLeft.minutes ||
                prev.seconds !== newTimeLeft.seconds
            ) {
                return newTimeLeft;
            }
            return { ...prev, difference: newTimeLeft.difference };
        });

        setActionTimeLeft(prev => {
            if (!newActionTimeLeft) return null;
            
            if (
                !prev ||
                prev.minutes !== newActionTimeLeft.minutes ||
                prev.seconds !== newActionTimeLeft.seconds
            ) {
                return newActionTimeLeft;
            }
            return prev;
        });

        // Limpiar interval si llegamos a cero
        if (newTimeLeft.difference <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [targetDate, canCancelUntil, calculateTimeLeft, calculateActionTimeLeft]);

    useEffect(() => {
        // Actualización inicial
        updateCountdowns();

        // Configurar interval con mejor precisión
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Usar requestAnimationFrame para mayor precisión en el timing
        let animationFrameId: number;
        let lastSecond = Math.floor(Date.now() / 1000);

        const tick = () => {
            const currentSecond = Math.floor(Date.now() / 1000);
            
            // Solo actualizar cuando cambie el segundo
            if (currentSecond !== lastSecond) {
                lastSecond = currentSecond;
                updateCountdowns();
            }

            // Continuar solo si no hemos llegado a cero
            if (timeLeft.difference > 0) {
                animationFrameId = requestAnimationFrame(tick);
            }
        };

        animationFrameId = requestAnimationFrame(tick);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [targetDate, canCancelUntil, updateCountdowns]);

    return {
        timeLeft,
        actionTimeLeft,
        isExpired: timeLeft.difference <= 0,
        isActionExpired: !actionTimeLeft,
        isNearExpiration: timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5,
        isActionNearExpiration: actionTimeLeft && actionTimeLeft.totalMinutes <= 5
    };
}