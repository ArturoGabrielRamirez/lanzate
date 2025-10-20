import { Store, Settings, Phone, MessageCircle, Facebook, Instagram, Twitter, DollarSign, Truck } from "lucide-react"
import * as motion from "motion/react-client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"
import { Switch } from "@/features/shadcn/components/ui/switch"

function AccountSkeleton() {
    return (
        <motion.div className="space-y-6">
            {/* Store Information Card */}
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="size-5" />
                            Información de la Tienda
                        </CardTitle>
                        <CardDescription>
                            Detalles básicos y contacto de tu tienda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Store Name */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">Nombre</p>
                                <Skeleton className="h-6 w-40" />
                            </div>
                            
                            {/* Description */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">Descripción</p>
                                <Skeleton className="h-6 w-48" />
                            </div>
                            
                            {/* Website */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">Sitio web</p>
                                <Skeleton className="h-6 w-56" />
                            </div>
                            
                            {/* Contact Phone */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                    <Phone className="size-4" />
                                    Teléfono de contacto
                                </p>
                                <Skeleton className="h-6 w-32" />
                            </div>
                            
                            {/* WhatsApp */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                    <MessageCircle className="size-4" />
                                    WhatsApp de contacto
                                </p>
                                <Skeleton className="h-6 w-32" />
                            </div>
                            
                            {/* Facebook */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                    <Facebook className="size-4" />
                                    Facebook
                                </p>
                                <Skeleton className="h-6 w-44" />
                            </div>
                            
                            {/* Instagram */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                    <Instagram className="size-4" />
                                    Instagram
                                </p>
                                <Skeleton className="h-6 w-44" />
                            </div>
                            
                            {/* Twitter/X */}
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                    <Twitter className="size-4" />
                                    X (Twitter)
                                </p>
                                <Skeleton className="h-6 w-44" />
                            </div>
                        </div>
                        
                        {/* Edit Store Button */}
                        <div className="mt-6 pt-6 border-t">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Operational Settings Card */}
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="size-5" />
                            Configuración Operacional
                        </CardTitle>
                        <CardDescription>
                            Configuración de delivery, precios y métodos de pago
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Delivery Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Truck className="size-4" />
                                    <h3 className="font-medium">Delivery</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                    {/* Offers Delivery */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium">Ofrece delivery</p>
                                            <p className="text-xs text-muted-foreground">
                                                Permite entregas a domicilio
                                            </p>
                                        </div>
                                        <Switch disabled />
                                    </div>
                                    
                                    {/* Delivery Price */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Precio de delivery</p>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="size-4" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                    
                                    {/* Free Delivery Minimum */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Mínimo para delivery gratis</p>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="size-4" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                    
                                    {/* Delivery Radius */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Radio de entrega</p>
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="size-4" />
                                    <h3 className="font-medium">Configuración de Pagos</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                    {/* Minimum Order Amount */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Monto mínimo de orden</p>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="size-4" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                    
                                    {/* Payment Methods */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium">Métodos de pago aceptados</p>
                                        <div className="space-y-2">
                                            {['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Mercado Pago', 'PayPal', 'Criptomonedas'].map((method, index) => (
                                                <motion.div
                                                    key={method}
                                                    className="flex items-center space-x-2"
                                                    initial={{ y: 5 }}
                                                    animate={{ y: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                                                >
                                                    <Checkbox disabled />
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {method}
                                                    </label>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Edit Operational Settings Button */}
                        <div className="mt-6 pt-6 border-t">
                            <Skeleton className="h-10 w-48" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Danger Zone Card */}
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                        <CardDescription>
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-32 bg-destructive/20" />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export { AccountSkeleton }