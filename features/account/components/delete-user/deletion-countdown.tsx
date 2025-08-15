import { Clock, AlertCircle, Timer } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { getMinutesUntil, formatTimeRemaining, getUrgencyLevel, getUrgencyColors } from "../../utils/utils";

export default function DeletionCountdown({ 
    displayScheduledDate, 
    timeRemaining,
    canCancelUntil,
    isWithinActionWindow = false,
    onAccountDeleted 
}: {
    displayScheduledDate: Date;
    timeRemaining: number | null;
    canCancelUntil?: Date | null;
    isWithinActionWindow?: boolean;
    onAccountDeleted?: () => void;
}) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    
    // ✅ NUEVO ESTADO: Para ventana de acción
    const [actionTimeLeft, setActionTimeLeft] = useState<{
        minutes: number;
        seconds: number;
        totalMinutes: number;
    } | null>(null);
    
    const [isDeleted, setIsDeleted] = useState(false);
    const [isCheckingDeletion, setIsCheckingDeletion] = useState(false);
    const supabase = createClient();

    // ✅ FUNCIÓN PARA CALCULAR TIEMPO RESTANTE hasta eliminación final
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

    // ✅ NUEVA FUNCIÓN: Calcular tiempo restante para ventana de acción
    const calculateActionTimeLeft = useCallback(() => {
        if (!canCancelUntil) return null;
        
        const now = new Date().getTime();
        const target = new Date(canCancelUntil).getTime();
        const difference = target - now;

        if (difference > 0) {
            const minutes = Math.floor(difference / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return { minutes, seconds, totalMinutes: minutes };
        }

        return null;
    }, [canCancelUntil]);

    // ✅ FUNCIÓN PARA VERIFICAR SI LA CUENTA FUE ELIMINADA - Sin cambios
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
            setIsDeleted(true);
            await handleAccountDeletion();
        } finally {
            setIsCheckingDeletion(false);
        }
    }, [isCheckingDeletion]);

    // ✅ FUNCIÓN PARA MANEJAR LA ELIMINACIÓN DE CUENTA - Sin cambios
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

    // ✅ FUNCIÓN PARA LIMPIAR COOKIES - Sin cambios
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

    // ✅ EFECTO PRINCIPAL DEL COUNTDOWN - Actualizado para manejar dos timers
    useEffect(() => {
        if (isDeleted) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setActionTimeLeft(null);
            return;
        }

        // Calcular tiempo inicial
        const initialTime = calculateTimeLeft();
        const initialActionTime = calculateActionTimeLeft();
        
        setTimeLeft(initialTime);
        setActionTimeLeft(initialActionTime);

        // Si ya no hay tiempo para la eliminación final, verificar
        if (initialTime.difference <= 0) {
            checkAccountStatus();
            return;
        }

        // Timer que actualiza cada segundo
        const timer = setInterval(() => {
            const currentTime = calculateTimeLeft();
            const currentActionTime = calculateActionTimeLeft();
            
            setTimeLeft(currentTime);
            setActionTimeLeft(currentActionTime);
            
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
    }, [displayScheduledDate, canCancelUntil, isDeleted, calculateTimeLeft, calculateActionTimeLeft, checkAccountStatus]);

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

    // ✅ CALCULAR URGENCIAS
    const actionUrgency = actionTimeLeft ? getUrgencyLevel(actionTimeLeft.totalMinutes) : 'expired';
    const actionColors = getUrgencyColors(actionUrgency);

    return (
        <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6 mb-6 space-y-6">
            
            {/* ✅ NUEVA SECCIÓN: Ventana de acción (si aplica) */}
            {canCancelUntil && (
                <div className="border-b border-gray-700 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 ${actionColors.bg} rounded-lg`}>
                            <Timer className={`h-5 w-5 ${actionColors.text}`} />
                        </div>
                        <h3 className={`font-semibold ${actionColors.text} text-lg`}>
                            Ventana de Acción
                        </h3>
                        <Badge className={`${actionColors.bg} ${actionColors.text} ${actionColors.border}`}>
                            {actionTimeLeft ? 'ACTIVA' : 'EXPIRADA'}
                        </Badge>
                    </div>

                    {actionTimeLeft ? (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className={`${actionColors.bg} rounded-lg p-4 text-center border ${actionColors.border}`}>
                                <div className={`text-3xl font-bold ${actionColors.text} mb-1`}>
                                    {String(actionTimeLeft.minutes).padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">
                                    Minutos
                                </div>
                            </div>
                            
                            <div className={`${actionColors.bg} rounded-lg p-4 text-center border ${actionColors.border}`}>
                                <div className={`text-3xl font-bold ${actionColors.text} mb-1`}>
                                    {String(actionTimeLeft.seconds).padStart(2, '0')}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">
                                    Segundos
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Alert className="bg-gray-500/10 border-gray-500/30">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <AlertDescription className="text-gray-400">
                                La ventana para cancelar o modificar la eliminación ha expirado.
                                Tu cuenta se procesará automáticamente según lo programado.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="text-center p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-300">
                            Puedes actuar hasta:{' '}
                            <span className={`font-semibold ${actionColors.text}`}>
                                {new Date(canCancelUntil).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </p>
                    </div>

                    {/* ✅ ALERTAS DE URGENCIA para ventana de acción */}
                    {actionTimeLeft && actionTimeLeft.totalMinutes <= 5 && (
                        <Alert className="bg-red-500/10 border-red-500/30 mt-4">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-red-400">
                                ⚠️ <strong>¡Últimos minutos!</strong> La ventana para cancelar cierra en {actionTimeLeft.totalMinutes} minutos.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

            {/* ✅ SECCIÓN PRINCIPAL: Countdown hasta eliminación final */}
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

                {/* ⏰ ADVERTENCIA EN LOS ÚLTIMOS MINUTOS de eliminación final */}
                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5 && (
                    <Alert className="bg-red-500/10 border-red-500/30 mt-4">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400">
                            ⚠️ <strong>¡Eliminación inminente!</strong> Tu cuenta será eliminada en menos de 5 minutos.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* ✅ INFORMACIÓN CONTEXTUAL */}
            <div className="border-t border-gray-700 pt-4">
                <Alert className="bg-blue-500/10 border-blue-500/30">
                    <AlertDescription className="text-blue-300 text-sm">
                        <strong>Explicación:</strong> La "Ventana de Acción" es el tiempo límite para cancelar o modificar tu solicitud de eliminación. 
                        Una vez que expire, la eliminación se procesará automáticamente en la fecha programada.
                    </AlertDescription>
                </Alert>
            </div>

            {/* ✅ DEBUG INFO - Solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
                <Alert className="bg-gray-900/50 border-gray-600">
                    <AlertDescription className="text-xs text-gray-500 font-mono space-y-1">
                        <div>DEBUG INFO:</div>
                        <div>• Final deletion: {new Date(displayScheduledDate).toISOString()}</div>
                        <div>• Action window until: {canCancelUntil ? new Date(canCancelUntil).toISOString() : 'N/A'}</div>
                        <div>• Within action window: {isWithinActionWindow ? 'YES' : 'NO'}</div>
                        <div>• Action time left: {actionTimeLeft ? `${actionTimeLeft.totalMinutes}min` : 'EXPIRED'}</div>
                        <div>• Final time left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</div>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}