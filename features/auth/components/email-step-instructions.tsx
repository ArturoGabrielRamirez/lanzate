'use client'
import { EmailStepInstructionsProps } from "../types";

export default function EmailStepInstructions({ stepStatus, initialOldEmail, newEmail }: EmailStepInstructionsProps 
) {
    return (
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
    );
}