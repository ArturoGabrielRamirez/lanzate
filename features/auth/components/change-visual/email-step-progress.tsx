'use client'

import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { EmailStepProgressProps } from "../../types";

export default function EmailStepProgress({ status, initialOldEmail, newEmail }: EmailStepProgressProps) {
    const getStepStatus = () => {
        if (!status.hasEmailChange) {
            return { step1: 'confirmed', step2: 'confirmed', currentStep: 'completed' };
        }

        if (status.oldEmailConfirmed) {
            return { step1: 'confirmed', step2: 'pending', currentStep: 'step2' };
        }

        return { step1: 'pending', step2: 'waiting', currentStep: 'step1' };
    };

    const stepStatus = getStepStatus();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stepStatus.step1 === 'confirmed'
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
                    <p className={`text-xs font-medium ${stepStatus.step1 === 'confirmed'
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stepStatus.step2 === 'confirmed'
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
                    <p className={`text-xs font-medium ${stepStatus.step2 === 'confirmed'
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
    );
}