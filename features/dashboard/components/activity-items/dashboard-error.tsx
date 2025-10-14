import { MessageCircleDashed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import { Link } from "@/i18n/naviation";

function DashboardError({ message }: { message: string }) {
    return (
        <Card className="bg-card rounded-lg border p-6 grow h-full">
            <CardHeader className="p-0 pb-4">
                <CardTitle>
                    <h2 className="text-2xl font-bold text-center">Actividad Reciente</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 grow flex items-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MessageCircleDashed />
                        </EmptyMedia>
                        <EmptyTitle>Error</EmptyTitle>
                        <EmptyDescription>
                            <p>Ocurrió un error al cargar el dashboard.</p>
                            <p>{message}</p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href="/stores">Reload page</Link>
                            </Button>
                        </div>
                    </EmptyContent>
                </Empty>
            </CardContent>
        </Card>
    )
}

export { DashboardError }