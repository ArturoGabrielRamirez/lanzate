import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "../types";
import { User } from "lucide-react";

export function StatsCard({ user, immediateData }: { user: UserType; immediateData?: { activeAccounts: number; storesCount: number; accountType: string } }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4" />
                    Estadísticas de la cuenta
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.activeAccounts ?? user.Account?.length ?? 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Planes activos
                        </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.storesCount ?? user.Store?.length ?? 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Tiendas creadas
                        </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-background to-primary/10">
                        <div className="text-2xl font-bold text-primary">
                            {immediateData?.accountType ?? user.Account?.[0]?.type ?? 'FREE'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Tipo de plan
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
