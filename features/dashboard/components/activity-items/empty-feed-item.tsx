import { MessageCircleDashed } from "lucide-react";

import { Button } from "@/features/shadcn/components/ui/button";
import { Card, CardContent } from "@/features/shadcn/components/ui/card";
import { getUserInfo } from "@/features/global/actions/get-user-info.action";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import { CreateStoreButtonNew } from "@/features/stores/components";
import { Link } from "@/i18n/naviation";

async function EmptyFeedItem() {

    const { payload: user } = await getUserInfo()

    return (
        <Card className="grow h-full group">
            <CardContent className="p-0 grow flex items-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MessageCircleDashed />
                        </EmptyMedia>
                        <EmptyTitle>No activity</EmptyTitle>
                        <EmptyDescription>
                            <p>Aquí podrás ver todos los likes, comentarios y pedidos de tus tiendas.</p>
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