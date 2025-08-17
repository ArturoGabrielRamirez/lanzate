import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateStoreButton from "@/features/stores/components/create-store-button";


interface EmptyFeedItemProps {
    userId: number;
}

function EmptyFeedItem({ userId }: EmptyFeedItemProps) {
    return (
        <div className="bg-card rounded-lg border p-6">
            <CardHeader className="p-0 pb-4">
                <CardTitle>
                    <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="text-center py-8">
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">¡Bienvenido a tu dashboard!</h3>
                    <p className="text-muted-foreground mb-4">
                        Aquí podrás ver toda la actividad reciente de tu tienda, incluyendo likes, comentarios, pedidos y contratos.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Cuando tengas actividad, aparecerá aquí automáticamente.
                    </p>
                    <CreateStoreButton userId={userId} className="w-full" />
                </div>
            </CardContent>
        </div>
    );
}

export default EmptyFeedItem