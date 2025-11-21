'use client'

import { EmailStepInstructionsProps } from "@/features/auth/types";

function EmailStepInstructions({ stepStatus, initialOldEmail, newEmail }: EmailStepInstructionsProps
) {
    return (
        <div className="space-y-3">
            {stepStatus.currentStep === 'step1' && (
                <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Paso 1:</strong> Revisá tu correo electrónico actual ({initialOldEmail}) y confirmá el cambio.
                    </p>
                </div>
            )}

            {stepStatus.currentStep === 'step2' && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Paso 2:</strong> Ahora revisá tu nuevo correo electrónico ({newEmail}) y confirmá para completar el cambio.
                    </p>
                </div>
            )}

            {stepStatus.currentStep === 'completed' && (
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>¡Completado!</strong> Tu correo electrónico fue actualizado exitosamente.
                    </p>
                </div>
            )}
        </div>
    );
}

export { EmailStepInstructions };