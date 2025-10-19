import { AlertTriangle } from "lucide-react"
import { Suspense } from "react"

import { DangerDeepZoneSkeleton, DangerZoneTab } from "@/features/account/components"
import { DeletionRequestedViewProps } from "@/features/account/types"
import { Title } from "@/features/layout/components"

export function DeletionRequestedView({
    user,
    deletionStatus,
    onStatusChange
}: DeletionRequestedViewProps) {
    return (
        <div className="h-screen flex flex-col overflow-hidden relative z-10">
            <div className="flex-shrink-0 p-4 pt-17">
                <Title
                    title={(
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle />
                            Cuenta en proceso de eliminación
                        </div>
                    )}
                    breadcrumbs={[
                        {
                            label: "Cuenta",
                            href: "/account"
                        }
                    ]}
                    showDate
                />
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-red-800">
                                Tu cuenta está programada para ser eliminada
                            </h3>
                            <p className="text-red-700 mt-1 text-sm">
                                Solo tienes acceso a la zona de peligro para gestionar la eliminación de tu cuenta.
                                {deletionStatus.canCancel && " Aún puedes cancelar la eliminación."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flex-1 px-4 pb-4 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <Suspense fallback={<DangerDeepZoneSkeleton />}>
                        <DangerZoneTab
                            userId={user.id}
                            onStatusChange={onStatusChange}
                        />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}