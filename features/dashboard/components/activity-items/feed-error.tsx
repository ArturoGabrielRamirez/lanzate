import { MessageCircleDashed } from "lucide-react";

import { FeedErrorProps } from "@/features/dashboard/types";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import { Button } from "@/features/shadcn/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card";
import { Link } from "@/i18n/naviation";

async function FeedError({ message }: FeedErrorProps) {

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
                            <p>Ocurrió un error al cargar la actividad reciente.</p>
                            <p>{message}</p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href="/stores">Recargar página</Link>
                            </Button>
                        </div>
                    </EmptyContent>
                </Empty>
            </CardContent>
        </Card>
    );
}

export { FeedError }