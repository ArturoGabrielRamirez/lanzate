import { MessageCircleDashed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserInfo } from "@/features/layout/actions";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new";
import { Link } from "@/i18n/naviation";

async function EmptyFeedItem() {

    const { payload: user } = await getUserInfo()

    return (
        <Card className="grow h-full border-dashed bg-card/50 group">
            <CardContent className="p-0 grow flex items-center opacity-50 group-hover:opacity-100 transition-all">
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