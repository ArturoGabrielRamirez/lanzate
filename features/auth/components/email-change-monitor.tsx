'use client'

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';

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
    const t = useTranslations("auth.email-change");
    
    const [status, setStatus] = useState({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        currentEmail: initialOldEmail,
        loading: true,
        hasEmailChange: true,
        processCompleted: false
    });

    const [checkCount, setCheckCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasCompletedRef = useRef(false);
    const isCheckingRef = useRef(false);
    const lastStatusRef = useRef<string>('');

    const checkStatus = async (force = false) => {
        if (isCheckingRef.current && !force) return;
        isCheckingRef.current = true;

        try {
            console.log(`🔍 Checking email status... (attempt ${checkCount + 1})`);
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
                
                // Crear un string para comparar cambios
                const statusString = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}-${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;
                
                console.log('📊 Status check result:', {
                    attempt: checkCount + 1,
                    statusString,
                    lastStatus: lastStatusRef.current,
                    changed: statusString !== lastStatusRef.current,
                    data: newStatus,
                    rawData: result.data
                });
                
                // Solo actualizar si hay cambios
                if (statusString !== lastStatusRef.current) {
                    console.log('🔄 Status changed, updating...');
                    setStatus(newStatus);
                    lastStatusRef.current = statusString;
                } else {
                    console.log('⏸️ No changes detected');
                    setStatus(prev => ({ ...prev, loading: false }));
                }
                
                setCheckCount(prev => prev + 1);
                
                // Verificar si el proceso está completo
                if (!newStatus.hasEmailChange || newStatus.processCompleted) {
                    console.log('✅ Email change process completed!');
                    
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;
                        
                        // Limpiar el polling
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        
                        setTimeout(() => onComplete(), 2000);
                    }
                } else if (newStatus.hasEmailChange) {
                    // Hay cambio pendiente, continuar polling
                    console.log('⏳ Process still pending, continuing polling...');
                }
            } else {
                console.error('❌ Failed to get email status:', result.error);
                setStatus(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error('❌ Error checking email status:', error);
            setStatus(prev => ({ ...prev, loading: false }));
        } finally {
            isCheckingRef.current = false;
        }
    };

    useEffect(() => {
        console.log('🚀 EmailChangeMonitor mounted');
        
        // Verificar estado inicial
        checkStatus(true);
        
        // Configurar polling más agresivo al inicio
        if (!hasCompletedRef.current) {
            intervalRef.current = setInterval(() => {
                if (!hasCompletedRef.current) {
                    checkStatus();
                }
            }, 3000); // 3 segundos
        }
        
        return () => {
            console.log('🧹 Cleaning up EmailChangeMonitor');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    // Limpiar polling cuando se completa
    useEffect(() => {
        if (!status.hasEmailChange || status.processCompleted) {
            console.log('🛑 Process completed or no pending change, clearing interval');
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
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Progress indicator */}
                <div className="space-y-4">
                    
                    {/* Step 1: Old email confirmation */}
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
                            <p className="font-medium text-sm">{t("step1.title")}</p>
                            <p className="text-xs text-muted-foreground">{initialOldEmail}</p>
                            <p className={`text-xs font-medium ${
                                stepStatus.step1 === 'confirmed' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                                {stepStatus.step1 === 'confirmed' ? t("step1.status.confirmed") : t("step1.status.pending")}
                            </p>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Step 2: New email confirmation */}
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
                            <p className="font-medium text-sm">{t("step2.title")}</p>
                            <p className="text-xs text-muted-foreground">{newEmail}</p>
                            <p className={`text-xs font-medium ${
                                stepStatus.step2 === 'confirmed' 
                                    ? 'text-green-600 dark:text-green-400'
                                    : stepStatus.step2 === 'pending'
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-500'
                            }`}>
                                {stepStatus.step2 === 'confirmed' 
                                    ? t("step2.status.completed") 
                                    : stepStatus.step2 === 'pending'
                                    ? t("step2.status.pending")
                                    : t("step2.status.waiting")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                    {stepStatus.currentStep === 'step1' && (
                        <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <strong>Paso 1:</strong> {t("instructions.step1", { email: initialOldEmail })}
                            </p>
                        </div>
                    )}
                    
                    {stepStatus.currentStep === 'step2' && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Paso 2:</strong> {t("instructions.step2", { email: newEmail })}
                            </p>
                        </div>
                    )}
                    
                    {stepStatus.currentStep === 'completed' && (
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                <strong>¡Completado!</strong> {t("instructions.completed")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action button */}
                <div className="pt-4 space-y-2">
                    {stepStatus.currentStep === 'completed' ? (
                        <Button onClick={onComplete} className="w-full">
                            {t("actions.back-to-account")}
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            onClick={() => checkStatus(true)}
                            disabled={status.loading || isCheckingRef.current}
                            className="w-full flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${(status.loading || isCheckingRef.current) ? 'animate-spin' : ''}`} />
                            {status.loading || isCheckingRef.current ? t("actions.checking") : t("actions.check-status")}
                        </Button>
                    )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    {t("auto-refresh")}
                </p>
            </CardContent>
        </Card>
    );
}