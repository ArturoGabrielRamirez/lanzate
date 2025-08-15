import { Clock, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";

export default function DeletionCountdown({ 
    displayScheduledDate, 
    timeRemaining,
    onAccountDeleted 
}: {
    displayScheduledDate: Date;
    timeRemaining: number | null;
    onAccountDeleted?: () => void;
}) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    
    const [isDeleted, setIsDeleted] = useState(false);
    const [isCheckingDeletion, setIsCheckingDeletion] = useState(false);
    const supabase = createClient();

    // ✅ FUNCIÓN PARA CALCULAR TIEMPO RESTANTE
    const calculateTimeLeft = useCallback(() => {
        const now = new Date().getTime();
        const target = new Date(displayScheduledDate).getTime();
        const difference = target - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds, difference };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0, difference: 0 };
    }, [displayScheduledDate]);

    // ✅ FUNCIÓN PARA VERIFICAR SI LA CUENTA FUE ELIMINADA
    const checkAccountStatus = useCallback(async () => {
        if (isCheckingDeletion) return;
        
        setIsCheckingDeletion(true);
        try {
            const response = await fetch('/api/user/deletion-status');
            
            if (response.status === 404 || response.status === 401) {
                setIsDeleted(true);
                await handleAccountDeletion();
                return;
            }
            
            if (response.ok) {
                const status = await response.json();
                if (!status.isDeletionRequested) {
                    const userCheckResponse = await fetch('/api/auth/check-user');
                    if (userCheckResponse.status === 404) {
                        setIsDeleted(true);
                        await handleAccountDeletion();
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando estado de cuenta:', error);
            // En caso de error de red, también verificar si fue eliminada
            setIsDeleted(true);
            await handleAccountDeletion();
        } finally {
            setIsCheckingDeletion(false);
        }
    }, [isCheckingDeletion]);

    // ✅ FUNCIÓN PARA MANEJAR LA ELIMINACIÓN DE CUENTA
    const handleAccountDeletion = async () => {
        try {
            await clearAuthCookies();
            onAccountDeleted?.();
            
            setTimeout(() => {
                window.location.href = '/login?message=account_deleted';
            }, 3000);
            
        } catch (error) {
            console.error('Error durante limpieza post-eliminación:', error);
            window.location.href = '/login?message=account_deleted';
        }
    };

    // ✅ FUNCIÓN PARA LIMPIAR COOKIES DE AUTENTICACIÓN
    const clearAuthCookies = async () => {
        try {
            const cookies = [
                'supabase-auth-token',
                'sb-access-token',
                'sb-refresh-token',
                'supabase.auth.token'
            ];
            
            cookies.forEach(cookieName => {
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            });
            
            localStorage.clear();
            sessionStorage.clear();
            
            if (supabase) {
                await supabase.auth.signOut();
            }
            
        } catch (error) {
            console.error('Error limpiando cookies:', error);
        }
    };

    // ✅ EFECTO PRINCIPAL DEL COUNTDOWN - SIMPLIFICADO
    useEffect(() => {
        if (isDeleted) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        // Calcular tiempo inicial
        const initialTime = calculateTimeLeft();
        setTimeLeft(initialTime);

        // Si ya no hay tiempo, verificar eliminación
        if (initialTime.difference <= 0) {
            checkAccountStatus();
            return;
        }

        // Timer que actualiza cada segundo
        const timer = setInterval(() => {
            const currentTime = calculateTimeLeft();
            setTimeLeft(currentTime);
            
            // Verificar eliminación cuando el tiempo se agota
            if (currentTime.difference <= 0) {
                clearInterval(timer);
                checkAccountStatus();
                return;
            }
            
            // Verificar eliminación en los últimos 10 segundos
            if (currentTime.difference < 10000) {
                checkAccountStatus();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [displayScheduledDate, isDeleted, calculateTimeLeft, checkAccountStatus]);

    // ✅ DEBUG: Log para verificar valores
    useEffect(() => {
        console.log('DeletionCountdown Debug:', {
            displayScheduledDate: displayScheduledDate,
            displayScheduledDateType: typeof displayScheduledDate,
            displayScheduledDateISO: new Date(displayScheduledDate).toISOString(),
            timeRemaining: timeRemaining,
            currentTime: new Date().toISOString(),
            calculatedTimeLeft: calculateTimeLeft()
        });
    }, [displayScheduledDate, timeRemaining, calculateTimeLeft]);

    // ✅ SI LA CUENTA FUE ELIMINADA, MOSTRAR MENSAJE
    if (isDeleted) {
        return (
            <div className="bg-gray-800 border border-red-500 rounded-lg p-6 mb-6">
                <Alert className="bg-red-500/10 border-red-500/30">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <AlertDescription className="text-red-400 font-medium">
                        Tu cuenta ha sido eliminada permanentemente. 
                        Serás redirigido automáticamente en unos momentos...
                    </AlertDescription>
                </Alert>
                
                <div className="mt-4 text-center">
                    <Button
                        onClick={() => window.location.href = '/login'}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        Ir a Inicio de Sesión
                    </Button>
                </div>
            </div>
        );
    }

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

            {/* ✅ DEBUG INFO - REMOVER EN PRODUCCIÓN */}
            <div className="mb-4 p-3 bg-gray-900/50 rounded border border-gray-600 text-xs text-gray-400">
                <div>Target: {new Date(displayScheduledDate).toLocaleString('es-ES')}</div>
                <div>Now: {new Date().toLocaleString('es-ES')}</div>
                <div>Difference: {Math.floor((new Date(displayScheduledDate).getTime() - new Date().getTime()) / 1000)}s</div>
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
                        {new Date(displayScheduledDate).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </p>
            </div>

            {/* ⏰ ADVERTENCIA EN LOS ÚLTIMOS MINUTOS */}
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5 && (
                <Alert className="bg-red-500/10 border-red-500/30 mt-4">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                        ⚠️ Tu cuenta será eliminada en menos de 5 minutos. 
                        Si cambias de opinión, cancela ahora mismo.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}