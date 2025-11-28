import { MessageCircleDashed } from "lucide-react";

import { getUserInfo } from "@/features/global/actions/get-user-info.action";
import { PERMISSIONS } from "@/features/plans/utils/constants";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import { AccessGate } from "@/features/shadcn/components/gate";
import { Button } from "@/features/shadcn/components/ui/button";
import { Card, CardContent } from "@/features/shadcn/components/ui/card";
import { CreateStoreButton } from "@/features/stores/components/create-form/create-store-button";
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
                        <EmptyTitle>No hay actividad</EmptyTitle>
                        <EmptyDescription>
                            <p>Acá vas a poder ver todos los likes, comentarios y pedidos de tus tiendas.</p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/stores">Administrar tiendas</Link>
                            </Button>
                            <AccessGate
                                roles={["free", "pro", "enterprise"]}
                                permissions={[PERMISSIONS.CREATE_STORE]}
                                mode="disable"
                            >
                                <CreateStoreButton userId={user?.id || 0} />
                            </AccessGate>
                        </div>
                    </EmptyContent>
                </Empty>
            </CardContent>
        </Card>
    );
}

export { EmptyFeedItem }