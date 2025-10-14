import { MessageCircleDashed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/features/layout/actions";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new";
import { Link } from "@/i18n/naviation";

async function EmptyFeedItem() {

    const { payload: user } = await getUserInfo()

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
                        <EmptyTitle>No activity</EmptyTitle>
                        <EmptyDescription>
                            <p>Aquí podrás ver toda la actividad reciente de tu tienda, incluyendo likes, comentarios, pedidos y contratos.</p>
                            <p>Cuando tengas actividad, aparecerá aquí automáticamente.</p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/stores">Manage stores</Link>
                            </Button>
                            <CreateStoreButtonNew userId={user?.id || 0} />
                        </div>
                    </EmptyContent>
                </Empty>
            </CardContent>
        </Card>
    );
}

export { EmptyFeedItem }