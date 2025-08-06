'use client'

import { useState, useEffect } from 'react';
import { ButtonWithPopup, InputField } from "@/features/layout/components";
import { handleEditEmail } from "@/features/auth/actions/handle-edit-email";
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';
import EmailChangeMonitor from "./email-change-monitor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { emailSchema } from '../schemas/change-email-schema';
import { Button } from "@/components/ui/button";
import { ChangeEmailButtonProps, PendingChangeData } from '../types';


export default function ChangeEmailButton({
    buttonText,
    title,
    className,
    currentEmail
}: ChangeEmailButtonProps) {
    const [showMonitor, setShowMonitor] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [hasPendingChange, setHasPendingChange] = useState(false);
    const [pendingChangeData, setPendingChangeData] = useState<PendingChangeData>({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        newEmail: '',
        processCompleted: false
    });

    useEffect(() => {
        const checkPendingChange = async () => {
            try {
                const result = await getEmailChangeStatus();
                
                if (result.success && result.data?.hasEmailChange) {
                    const pendingData: PendingChangeData = {
                        oldEmailConfirmed: result.data.oldEmailConfirmed || false,
                        newEmailConfirmed: result.data.newEmailConfirmed || false,
                        newEmail: result.data.newEmail || '',
                        processCompleted: result.data.processCompleted || false
                    };

                    setHasPendingChange(true);
                    setNewEmail(result.data.newEmail || '');
                    setPendingChangeData(pendingData);
                    
                } else if (result.success) {
                    setHasPendingChange(false);
                    setPendingChangeData({
                        oldEmailConfirmed: false,
                        newEmailConfirmed: false,
                        newEmail: '',
                        processCompleted: false
                    });
                }
            } catch (error) {
                console.error('❌ ChangeEmailButton: Error checking pending change:', error);
            }
        };
        
        checkPendingChange();
    }, []);

    async function changeEmailAction(formData: {
        currentPassword: string;
        email: string;
    }) {
        if (formData.email === currentEmail) {
            return {
                error: true,
                message: "El nuevo email debe ser diferente al actual",
                payload: null
            };
        }

        try {
            const result = await handleEditEmail(formData.email);

            if (result.error) {
                return {
                    error: true,
                    message: result.error,
                    payload: null
                };
            }

            const newPendingData: PendingChangeData = {
                oldEmailConfirmed: false,
                newEmailConfirmed: false,
                newEmail: formData.email,
                processCompleted: false
            };

            setNewEmail(formData.email);
            setHasPendingChange(true);
            setPendingChangeData(newPendingData);
            setShowMonitor(true);

            return {
                error: false,
                message: "Proceso iniciado. Revisa ambos emails para confirmar.",
                payload: result.data || null
            };
        } catch (error) {
            return {
                error: true,
                message: "Error inesperado al cambiar el email",
                payload: null
            };
        }
    }

    const handleMonitorComplete = () => {
        setShowMonitor(false);
        setHasPendingChange(false);
        setNewEmail('');
        setPendingChangeData({
            oldEmailConfirmed: false,
            newEmailConfirmed: false,
            newEmail: '',
            processCompleted: false
        });
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleShowMonitor = () => {
        if (hasPendingChange) {
            setShowMonitor(true);
        }
    };

    const getProgressText = () => {
        if (!hasPendingChange) return '';
        
        if (pendingChangeData.processCompleted || 
            (pendingChangeData.oldEmailConfirmed && pendingChangeData.newEmailConfirmed)) {
            return '✅ Completado';
        } else if (pendingChangeData.oldEmailConfirmed) {
            return '⏳ Paso 2/2';
        } else {
            return '⏳ Paso 1/2';
        }
    };

    const isProcessCompleted = pendingChangeData.processCompleted || 
        (pendingChangeData.oldEmailConfirmed && pendingChangeData.newEmailConfirmed);

    return (
        <>
            <div className="flex items-center gap-2">
                <ButtonWithPopup
                    text={buttonText}
                    title={title}
                    description="Por seguridad, confirma tu contraseña actual. Te enviaremos emails de verificación a ambas direcciones."
                    action={changeEmailAction}
                    schema={emailSchema}
                    messages={{
                        success: "Emails de verificación enviados",
                        error: "Error al cambiar el email",
                        loading: "Enviando emails de verificación..."
                    }}
                    className={className}
                    variant="default"
                    onComplete={() => {}}
                    disabled={hasPendingChange && !isProcessCompleted}
                >
                    <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Email actual:</strong> {currentEmail}
                        </p>
                    </div>
                    
                    {hasPendingChange && !isProcessCompleted && (
                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <strong>⚠️ Hay un cambio en progreso</strong><br/>
                                Completa el proceso actual antes de iniciar uno nuevo.
                            </p>
                        </div>
                    )}

                    {hasPendingChange && isProcessCompleted && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                <strong>✅ Cambio completado</strong><br/>
                                Tu email ha sido actualizado exitosamente. Puedes iniciar un nuevo cambio si es necesario.
                            </p>
                        </div>
                    )}
                    
                    <InputField
                        name="email"
                        label="Nuevo email"
                        type="email"
                        placeholder="nuevo-email@ejemplo.com"
                        disabled={hasPendingChange && !isProcessCompleted}
                    />
                    <InputField
                        name="currentPassword"
                        label="Contraseña actual"
                        type="password"
                        placeholder="Tu contraseña actual"
                        disabled={hasPendingChange && !isProcessCompleted}
                    />
                </ButtonWithPopup>
                
                {hasPendingChange && (
                    <Button
                        variant={isProcessCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={handleShowMonitor}
                        className="text-xs whitespace-nowrap flex items-center gap-1"
                    >
                        {getProgressText()}
                    </Button>
                )}
            </div>

            <Dialog open={showMonitor} onOpenChange={setShowMonitor}>
                <DialogContent className="max-w-md">
                    <EmailChangeMonitor
                        onComplete={handleMonitorComplete}
                        initialOldEmail={currentEmail}
                        newEmail={newEmail}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}