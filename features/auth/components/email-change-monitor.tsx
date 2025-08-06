'use client'

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock, ArrowRight, RefreshCw, AlertTriangle, Send } from "lucide-react";
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';
import { resendEmailConfirmation } from '@/features/auth/actions/resend-email-confirmation';
import { toast } from 'sonner';

interface EmailChangeMonitorProps {
    onComplete: () => void;
    initialOldEmail: string;
    newEmail: string;
}

export default function EmailChangeMonitor({ 
    onComplete, 
    initialOldEmail, 
    newEmail 
}: EmailChangeMonitorProps) {
    const [status, setStatus] = useState({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        currentEmail: initialOldEmail,
        loading: true,
        hasEmailChange: true,
        processCompleted: false
    });

    const [isResending, setIsResending] = useState(false);
    const [isManuallyChecking, setIsManuallyChecking] = useState(false); // Nuevo estado para verificación manual
    const [resendCooldown, setResendCooldown] = useState(0); // Cooldown en segundos
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref para el intervalo del cooldown
    const hasCompletedRef = useRef(false);
    const isCheckingRef = useRef(false);
    const lastStatusRef = useRef<string>('');

    const checkStatus = async (force = false, isManual = false) => {
        if (isCheckingRef.current && !force) return;
        isCheckingRef.current = true;

        // Si es una verificación manual, activar la animación
        if (isManual) {
            setIsManuallyChecking(true);
        }

        try {
            const result = await getEmailChangeStatus();
            
            if (result.success && result.data) {
                const newStatus = {
                    oldEmailConfirmed: result.data.oldEmailConfirmed || false,
                    newEmailConfirmed: result.data.newEmailConfirmed || false,
                    currentEmail: result.data.currentEmail ?? initialOldEmail,
                    loading: false,
                    hasEmailChange: result.data.hasEmailChange ?? false,
                    processCompleted: result.data.processCompleted || false
                };

                const statusString = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}-${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;
                
                if (statusString !== lastStatusRef.current) {
                    setStatus(newStatus);
                    lastStatusRef.current = statusString;
                } else {
                    setStatus(prev => ({ ...prev, loading: false }));
                }
                
                if (!newStatus.hasEmailChange || newStatus.processCompleted) {
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;
                        
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setTimeout(() => onComplete(), 2000);
                    }
                }
            } else {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, loading: false }));
        } finally {
            isCheckingRef.current = false;
            
            // Si fue una verificación manual, esperar un poco antes de desactivar la animación
            if (isManual) {
                setTimeout(() => {
                    setIsManuallyChecking(false);
                }, 800); // Mantener la animación por 800ms adicionales
            }
        }
    };

    // Función específica para el botón de verificar manual
    const handleManualCheck = () => {
        checkStatus(true, true);
    };

    // Función para iniciar el cooldown
    const startResendCooldown = () => {
        setResendCooldown(60); // 60 segundos
        
        cooldownIntervalRef.current = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    if (cooldownIntervalRef.current) {
                        clearInterval(cooldownIntervalRef.current);
                        cooldownIntervalRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendEmails = async () => {
        if (resendCooldown > 0) return; // Evitar reenvío durante cooldown
        
        setIsResending(true);
        try {
            const result = await resendEmailConfirmation();
            
            if (result.success) {
                toast.success('Emails reenviados', {
                    description: 'Revisa tu bandeja de entrada y spam en ambos emails.',
                    duration: 5000
                });
                startResendCooldown(); // Iniciar cooldown solo si fue exitoso
                setTimeout(() => {
                    checkStatus(true);
                }, 1000);
            } else {
                toast.error('Error al reenviar', {
                    description: result.error || 'No se pudieron reenviar los emails',
                    duration: 5000
                });
            }
        } catch (error) {
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al reenviar los emails',
                duration: 5000
            });
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        checkStatus(true);
        if (!hasCompletedRef.current) {
            intervalRef.current = setInterval(() => {
                if (!hasCompletedRef.current) {
                    checkStatus();
                }
            }, 3000);
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current);
                cooldownIntervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!status.hasEmailChange || status.processCompleted) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [status.hasEmailChange, status.processCompleted]);

    const getStepStatus = () => {
        if (!status.hasEmailChange) {
            return {
                step1: 'confirmed',
                step2: 'confirmed',
                currentStep: 'completed'
            };
        }
        
        if (status.oldEmailConfirmed) {
            return {
                step1: 'confirmed',
                step2: 'pending',
                currentStep: 'step2'
            };
        }
        
        return {
            step1: 'pending',
            step2: 'waiting',
            currentStep: 'step1'
        };
    };

    const stepStatus = getStepStatus();

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Confirmación de Cambio de Email
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            stepStatus.step1 === 'confirmed' 
                                ? 'bg-green-100 dark:bg-green-900' 
                                : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                            {stepStatus.step1 === 'confirmed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                                <Clock className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Confirmar email actual</p>
                            <p className="text-xs text-muted-foreground">{initialOldEmail}</p>
                            <p className={`text-xs font-medium ${
                                stepStatus.step1 === 'confirmed' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                                {stepStatus.step1 === 'confirmed' ? '✓ Confirmado' : 'Esperando confirmación...'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            stepStatus.step2 === 'confirmed' 
                                ? 'bg-green-100 dark:bg-green-900' 
                                : stepStatus.step2 === 'pending'
                                ? 'bg-blue-100 dark:bg-blue-900'
                                : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                            {stepStatus.step2 === 'confirmed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : stepStatus.step2 === 'pending' ? (
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                                <Clock className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Confirmar nuevo email</p>
                            <p className="text-xs text-muted-foreground">{newEmail}</p>
                            <p className={`text-xs font-medium ${
                                stepStatus.step2 === 'confirmed' 
                                    ? 'text-green-600 dark:text-green-400'
                                    : stepStatus.step2 === 'pending'
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-500'
                            }`}>
                                {stepStatus.step2 === 'confirmed' 
                                    ? '✓ Confirmado - ¡Cambio completado!' 
                                    : stepStatus.step2 === 'pending'
                                    ? '⏳ Revisa este email y confirma'
                                    : 'Esperando confirmación del email actual...'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {stepStatus.currentStep === 'step1' && (
                        <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <strong>Paso 1:</strong> Revisa tu email actual ({initialOldEmail}) y confirma el cambio.
                            </p>
                        </div>
                    )}
                    
                    {stepStatus.currentStep === 'step2' && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Paso 2:</strong> Ahora revisa tu nuevo email ({newEmail}) y confirma para completar el cambio.
                            </p>
                        </div>
                    )}
                    
                    {stepStatus.currentStep === 'completed' && (
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                <strong>¡Completado!</strong> Tu email ha sido actualizado exitosamente.
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="pt-4 space-y-2">
                    {stepStatus.currentStep === 'completed' ? (
                        <Button onClick={onComplete} className="w-full">
                            Volver a mi cuenta
                        </Button>
                    ) : (
                        <div className="space-y-2">
                            {/* Botón principal: verificar estado con animaciones mejoradas */}
                            <Button 
                                variant="outline" 
                                onClick={handleManualCheck}
                                disabled={status.loading || isManuallyChecking}
                                className={`w-full flex items-center gap-2 transition-all duration-300 ${
                                    isManuallyChecking 
                                        ? 'scale-95 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700' 
                                        : 'hover:scale-[1.02]'
                                }`}
                            >
                                <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${
                                    (status.loading || isManuallyChecking) 
                                        ? 'animate-spin' 
                                        : ''
                                }`} />
                                {isManuallyChecking 
                                    ? 'Verificando...' 
                                    : status.loading 
                                    ? 'Cargando...' 
                                    : 'Verificar estado'
                                }
                            </Button>
                            
                            {/* Botón secundario: reenviar emails con cooldown */}
                            <Button 
                                variant="secondary" 
                                onClick={handleResendEmails}
                                disabled={isResending || status.loading || resendCooldown > 0}
                                className={`w-full flex items-center gap-2 transition-all duration-200 ${
                                    isResending ? 'scale-95' : 'hover:scale-[1.02]'
                                } ${resendCooldown > 0 ? 'opacity-60' : ''}`}
                                size="sm"
                            >
                                <Send className={`w-4 h-4 ${isResending ? 'animate-pulse' : ''}`} />
                                {isResending 
                                    ? 'Reenviando...' 
                                    : resendCooldown > 0 
                                    ? `Espera ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
                                    : 'Reenviar emails'
                                }
                            </Button>
                        </div>
                    )}
                    
                    {/* Helper text for resend con información del cooldown */}
                    {stepStatus.currentStep !== 'completed' && (
                        <p className="text-xs text-muted-foreground text-center">
                            {resendCooldown > 0 
                                ? `Podrás reenviar emails nuevamente en ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
                                : 'Si no recibes los emails, verifica tu carpeta de spam o haz clic en "Reenviar emails"'
                            }
                        </p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    La página se actualiza automáticamente cada 3 segundos
                </p>
            </CardContent>
        </Card>
    );
}