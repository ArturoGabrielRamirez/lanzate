import { getBranchDetails } from "@/features/branches/actions/getBranchDetails"
import EditBranchButton from "@/features/branches/components/edit-branch-button"
import DeleteBranchButton from "@/features/branches/components/delete-branch-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BranchDetailPageProps } from "@/features/branches/types"
import { ArrowLeft, MapPin, Phone, Mail, Crown, Package, ShoppingCart, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getTranslations } from "next-intl/server"

async function BranchDetailPage({ params }: BranchDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: branch, error } = await getBranchDetails(id)

    if (error || !branch) {
        return console.log(error)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const t = await getTranslations("store.branches")

    const totalProducts = branch.stock?.length || 0
    const totalOrders = branch.orders?.length || 0
    const totalRevenue = branch.orders?.reduce((sum: number, order: any) => sum + order.total_price, 0) || 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/branches`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                   {t("branch-details")}
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] grid-rows-[auto_1fr] lg:grid-rows-1 gap-6 w-full">
                    {/* Branch Icon/Image */}
                    <div className="w-full h-35 lg:h-full lg:w-60 xl:w-80 overflow-hidden rounded-md group bg-secondary relative flex items-center justify-center">
                        <img 
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${branch.name}`} 
                            alt="Branch Icon" 
                            className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 rounded-md" 
                        />
                    </div>
                    
                    {/* Branch Details */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-4xl font-bold">{branch.name}</h3>
                                {branch.is_main && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        {t("main-branch")}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xl text-muted-foreground">{branch.store.name}</p>
                        </div>

                        {/* Description */}
                        {branch.description && (
                            <p className="text-muted-foreground">{branch.description}</p>
                        )}

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t("address")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {branch.address || t("no-address")}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t("phone")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {branch.phone || t("no-phone")}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t("email")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {branch.email || t("no-email")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <Package className="w-4 h-4 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">{t("products-in-stock")}</p>
                                    <p className="text-2xl font-bold">{totalProducts}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <ShoppingCart className="w-4 h-4 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium">{t("total-orders")}</p>
                                    <p className="text-2xl font-bold">{totalOrders}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                                <DollarSign className="w-4 h-4 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium">{t("revenue")}</p>
                                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Creation Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Created on {formatDate(branch.created_at)}</span>
                        </div>

                        {/* Recent Orders */}
                        {branch.orders && branch.orders.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2">{t("recent-orders")}</h4>
                                <div className="space-y-2">
                                    {branch.orders.slice(0, 5).map((order: any) => (
                                        <div key={order.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                                            <div>
                                                <p className="text-sm font-medium">{t("order")}#{order.id}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">${order.total_price}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-auto">
                            <div className="grid grid-cols-2 gap-4 mt-auto justify-end max-w-xs">
                                {!branch.is_main && (
                                    <DeleteBranchButton
                                        branchId={branch.id}
                                        slug={slug}
                                        userId={user.id}
                                    />
                                )}
                                <EditBranchButton
                                    branch={branch}
                                    slug={slug}
                                    userId={user.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BranchDetailPage 